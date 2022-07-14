// component
import Iconify from '../../components/Iconify';

// ----------------------------------------------------------------------

const getIcon = (name) => <Iconify icon={name} width={22} height={22} />;

const sidebarConfig = [
  {
    title: 'trip 1',
    path: '/trip1',
    icon: getIcon('eva:shopping-bag-fill')
  },
  {
    title: 'trip 2',
    path: '/trip2',
    icon: getIcon('eva:shopping-bag-fill')
  },
  {
    title: 'trip 3',
    path: '/trip3',
    icon: getIcon('eva:shopping-bag-fill')
  },
  {
    title: 'trip 4',
    path: '/trip4',
    icon: getIcon('eva:shopping-bag-fill')
  },
  {
    title: 'trip 5',
    path: '/trip5',
    icon: getIcon('eva:shopping-bag-fill')
  },
  {
    title: 'trip 6',
    path: '/trip6',
    icon: getIcon('eva:shopping-bag-fill')
  }
];

export default sidebarConfig;
