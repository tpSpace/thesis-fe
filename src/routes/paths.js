function path(root, sublink) {
  return `${root}${sublink}`;
}

const ROOTS_AUTH = '/auth';
const ROOTS_APP = '/app';

export const PATH_AUTH = {
  root: ROOTS_AUTH,
  login: path(ROOTS_AUTH, '/login'),
  register: path(ROOTS_AUTH, '/register'),
};

export const PATH_APP = {
  root: ROOTS_APP,
  user: {
    root: path(ROOTS_APP, '/user'),
    myAccount: path(ROOTS_APP, '/user/my-account'),
    all: path(ROOTS_APP, '/user/all'),
    new: path(ROOTS_APP, '/user/new'),
    edit: (userId) => path(ROOTS_APP, `/user/${userId}/edit`),
    view: (userId) => path(ROOTS_APP, `/user/${userId}`)
  },
  course: {
    root: path(ROOTS_APP, '/course'),
    all: path(ROOTS_APP, '/course/all'),
    new: path(ROOTS_APP, '/course/new'),
    edit: (courseId) => path(ROOTS_APP, `/course/${courseId}/edit`),
    view: (courseId) => path(ROOTS_APP, `/course/${courseId}`)
  },
  assignment: {
    root: path(ROOTS_APP, '/assignment'),
    new: path(ROOTS_APP, '/assignment/new'),
    all: path(ROOTS_APP, '/assignment/all'),
    edit: (assignmentId) => path(ROOTS_APP, `/assignment/${assignmentId}/edit`),
    assign: (assignmentId) => path(ROOTS_APP, `/assignment/${assignmentId}/assign`),
    view: (assignmentId) => path(ROOTS_APP, `/assignment/${assignmentId}`),
    assigned: {
      root: path(ROOTS_APP, '/assignment/assigned'),
      all: path(ROOTS_APP, '/assignment/assigned/all'),
      view: (assignmentId) => path(ROOTS_APP, `/assignment/assigned/${assignmentId}`),
      question: (assignmentId) => path(ROOTS_APP, `/assignment/assigned/${assignmentId}/question`)
    }
  },
  analyzer: {
    root: path(ROOTS_APP, '/analyzer'),
    all: path(ROOTS_APP, '/analyzer/all'),
    new: path(ROOTS_APP, '/analyzer/new'),
    view: (analyzerId) => path(ROOTS_APP, `/analyzer/${analyzerId}`),
    edit: (analyzerId) => path(ROOTS_APP, `/analyzer/${analyzerId}/edit`)
  }
}