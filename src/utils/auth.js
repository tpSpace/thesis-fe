const isAdmin = (user) => {
    return user.role.id == 1;
};

const isTeacher = (user) => {
    return user.role.id == 2;
}

const isStudent = (user) => {
    return user.role.id == 3;
}

module.exports = {
    isAdmin,
    isTeacher,
    isStudent
}