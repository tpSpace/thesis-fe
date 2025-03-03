const isAdmin = (user) => user.role.id === 1;
const isTeacher = (user) => user.role.id === 2;
const isStudent = (user) => user.role.id === 3;

export { isAdmin, isTeacher, isStudent };
