import { supabaseAdmin } from '../../lib/supabaseAdmin';

async function syncUserRoles() {
  // Fetch all users
  const { data: usersData, error: usersError } = await supabaseAdmin.auth.admin.listUsers();
  if (usersError) throw usersError;
  const users = usersData?.users || [];

  // Fetch all roles
  const { data: rolesData, error: rolesError } = await supabaseAdmin.from('roles').select('*');
  if (rolesError) throw rolesError;
  const rolesArray = rolesData || [];

  // Insert user_roles for each user based on user_metadata.roles
  for (const user of users) {
    const metaRoles: string[] = user.user_metadata?.roles || [];

    for (const roleName of metaRoles) {
      const role = rolesArray.find(r => r.name === roleName);
      if (!role) continue;

      // Check if this user-role already exists to avoid duplicates
      const { data: existing } = await supabaseAdmin
        .from('user_roles')
        .select('*')
        .eq('user_id', user.id)
        .eq('role_id', role.id)
        .single();

      if (!existing) {
        await supabaseAdmin.from('user_roles').insert({
          user_id: user.id,
          role_id: role.id,
        });
      }
    }
  }

  console.log('Sync completed!');
}

syncUserRoles().catch(console.error);
