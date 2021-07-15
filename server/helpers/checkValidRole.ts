function hasDuplicates(array: Array<string>) {
  return new Set(array).size !== array.length;
}

export default (roles: Array<string>) => {
  if (roles.includes("student") && roles.includes("teacher")) return false;
  
  if (
    !roles ||
    !Array.isArray(roles) ||
    roles.length === 0 ||
    roles.length > 2 ||
    hasDuplicates(roles)
  )
    return false;

  return roles.every(
    (role) =>
      typeof role == "string" && ["student", "teacher", "admin"].includes(role)
  );
};
