const auth = require('../src/utils/auth');

describe('Auth utility functions', () => {
  test('isAdmin returns true for admin users', () => {
    const adminUser = { role: { id: 1 } };
    expect(auth.isAdmin(adminUser)).toBe(true);
  });
  
  test('isAdmin returns false for non-admin users', () => {
    const teacherUser = { role: { id: 2 } };
    expect(auth.isAdmin(teacherUser)).toBe(false);
  });
  
  test('isTeacher returns true for teacher users', () => {
    const teacherUser = { role: { id: 2 } };
    expect(auth.isTeacher(teacherUser)).toBe(true);
  });
  
  test('isStudent returns true for student users', () => {
    const studentUser = { role: { id: 3 } };
    expect(auth.isStudent(studentUser)).toBe(true);
  });
});