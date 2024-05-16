import {PATH_APP} from '../../../routes/paths';
import SvgIconStyle from '../../../components/SvgIconStyle';

const getIcon = (name) => <SvgIconStyle src={`/icons/${name}.svg`} sx={{ width: 1, height: 1 }} />;

const ICONS = {
  user: getIcon('ic_user'),
  course: getIcon('ic_kanban'),
  assignment: getIcon('ic_banking'),
  analyzer: getIcon('ic_booking'),
};

const navConfig = [
  {
    items: [
      {
        title: 'user',
        pth: PATH_APP.user.root,
        icon: ICONS.user,
        children: [
          { title: 'all user', path: PATH_APP.user.all },
          { title: 'my account', path: PATH_APP.user.myAccount },
        ]
      },
      {
        title: 'course',
        path: PATH_APP.course.root,
        icon: ICONS.course,
      },
      {
        title: 'assignment',
        pth: PATH_APP.assignment.root,
        icon: ICONS.assignment,
        children: [
          { title: 'all assignment', path: PATH_APP.assignment.all },
          { title: 'assigned', path: PATH_APP.assignment.assigned.root }
        ]
      },
      {
        title: 'analyzer',
        pth: PATH_APP.analyzer.root,
        icon: ICONS.analyzer,
        children: [
          { title: 'all analyzer', path: PATH_APP.analyzer.all },
        ]
      }
    ]
  }
];

export default navConfig;
