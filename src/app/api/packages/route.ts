import { createClient } from '@supabase/supabase-js';
import { promises as fs } from 'fs';
import path from 'path';
import { SolarPackage, DEFAULT_ADMIN_PACKAGES } from '@/lib/packages';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = supabaseUrl && supabaseServiceKey ? createClient(supabaseUrl, supabaseServiceKey) : null;
const packagesFile = path.join(process.cwd(), 'data', 'packages.json');

async function readPackagesFromFile(): Promise<SolarPackage[]> {
  try {
    const raw = await fs.readFile(packagesFile, 'utf8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : DEFAULT_ADMIN_PACKAGES;
  } catch (error) {
    return DEFAULT_ADMIN_PACKAGES;
  }
}

async function writePackagesToFile(packages: SolarPackage[]) {
  try {
    await fs.mkdir(path.dirname(packagesFile), { recursive: true });
    await fs.writeFile(packagesFile, JSON.stringify(packages, null, 2), 'utf8');
  } catch (err) {
    // In serverless environments (Vercel) filesystem writes can fail.
    // Log and continue so the API doesn't crash on deploy/runtime.
    console.error('writePackagesToFile error:', err);
  }
}

async function tryLoadPackages(): Promise<SolarPackage[]> {
  if (supabase) {
    try {
      const { data, error } = await supabase.from('packages').select('*');
      if (!error && Array.isArray(data)) {
        return data as SolarPackage[];
      }
    } catch {
      // ignore and fallback to file storage
    }
  }
  return readPackagesFromFile();
}

async function trySavePackages(packages: SolarPackage[]) {
  if (supabase) {
    try {
      await supabase.from('packages').delete().neq('id', '');
      const { error } = await supabase.from('packages').insert(
        packages.map((pkg: SolarPackage) => ({
          id: pkg.id,
          name: pkg.name,
          capacity: pkg.capacity,
          type: pkg.type,
          description: pkg.description,
          warranty: pkg.warranty,
          products: pkg.products,
          installation_cost: pkg.installationCost,
          transportation_cost: pkg.transportationCost,
          other_charges: pkg.otherCharges,
          profit_margin_pct: pkg.profitMarginPct,
          active: pkg.active,
          popular: pkg.popular,
        }))
      );
      if (!error) return;
    } catch {
      // ignore and fallback to file storage
      console.error('Supabase save error');
    }
  }

  try {
    await writePackagesToFile(packages);
  } catch (err) {
    console.error('writePackagesToFile failed:', err);
  }
}

// GET all packages
export async function GET() {
  try {
    const packages = await tryLoadPackages();
    return NextResponse.json({ ok: true, packages });
  } catch (e) {
    return NextResponse.json({ ok: false, message: 'Server error' }, { status: 500 });
  }
}

// POST to create or update packages (upsert all)
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { packages } = body;

    if (!Array.isArray(packages)) {
      return NextResponse.json({ ok: false, message: 'Invalid packages' }, { status: 400 });
    }

    await trySavePackages(packages);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ ok: false, message: 'Server error' }, { status: 500 });
  }
}
