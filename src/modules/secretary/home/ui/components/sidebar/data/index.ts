import { paths } from '@/lib/paths';
import * as Icons from '../icons';

export const NAV_DATA = [
  {
    label: 'إدارة السكرتارية والتوثيق',
    items: [
      {
        title: 'لوحة التحكم',
        url: paths.secretaryDashboard(),
        icon: Icons.HomeIcon,
        items: [],
      },
      {
        title: 'البريد',
        icon: Icons.EmailIcon,
        items: [
          {
            title: 'كل البريد',
            url: paths.mailsPage(),
          },
          {
            title: 'يجب متابعته',
            url: '/secretary/tracking',
          },
        ],
      },
      {
        title: 'الملفات',
        url: paths.documentsPage(),
        icon: Icons.DocumentIcon,
        items: [],
      },
      {
        title: 'جهات الاتصال',
        url: paths.contactsPage(),
        icon: Icons.ContactsIcon,
        items: [],
      },
      {
        title: 'المجلدات',
        url: paths.categoriesPage(),
        icon: Icons.CategoryIcon,
        items: [],
      },
      {
        title: 'الإدارات',
        url: paths.departmentsPage(),
        icon: Icons.DepartmentIcon,
        items: [],
      },
      {
        title: 'المستخدمون',
        url: paths.usersPage(),
        icon: Icons.User,
        items: [],
      },
      {
        title: 'سجل التعديلات',
        url: paths.auditLogsPage(),
        icon: Icons.AuditLogs,
        items: [],
      },
      // {
      //   title: 'Forms',
      //   icon: Icons.Alphabet,
      //   items: [
      //     {
      //       title: 'Form Elements',
      //       url: '/forms/form-elements',
      //     },
      //     {
      //       title: 'Form Layout',
      //       url: '/forms/form-layout',
      //     },
      //   ],
      // },
      // {
      //   title: 'Tables',
      //   url: '/tables',
      //   icon: Icons.Table,
      //   items: [
      //     {
      //       title: 'Tables',
      //       url: '/tables',
      //     },
      //   ],
      // },
      // {
      //   title: 'Pages',
      //   icon: Icons.Alphabet,
      //   items: [
      //     {
      //       title: 'Settings',
      //       url: '/pages/settings',
      //     },
      //   ],
      // },
    ],
  },
  // {
  //   label: 'OTHERS',
  //   items: [
  //     {
  //       title: 'Charts',
  //       icon: Icons.PieChart,
  //       items: [
  //         {
  //           title: 'Basic Chart',
  //           url: '/charts/basic-chart',
  //         },
  //       ],
  //     },
  //     {
  //       title: 'UI Elements',
  //       icon: Icons.FourCircle,
  //       items: [
  //         {
  //           title: 'Alerts',
  //           url: '/ui-elements/alerts',
  //         },
  //         {
  //           title: 'Buttons',
  //           url: '/ui-elements/buttons',
  //         },
  //       ],
  //     },
  //     {
  //       title: 'Authentication',
  //       icon: Icons.Authentication,
  //       items: [
  //         {
  //           title: 'Sign In',
  //           url: '/auth/sign-in',
  //         },
  //       ],
  //     },
  //   ],
  // },
];
