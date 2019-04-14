export default [
  // user
  {
    path: '/user',
    component: '../layouts/UserLayout',
    routes: [
      { path: '/user', redirect: '/user/login' },
      { path: '/user/login', component: './User/Login' },
      { path: '/user/register', component: './User/Register' },
      { path: '/user/register-result', component: './User/RegisterResult' },
    ],
  },
  // app
  {
    path: '/',
    component: '../layouts/BasicLayout',
    // Routes: ['src/pages/Authorized'],
    // authority: ['admin', 'user'],
    routes: [
      // list
      { path: '/', redirect: '/user' },
      {
        path: '/list',
        icon: 'table',
        name: 'list',
        component: './Manage/Manage',
      },
      // personnelManage
      {
        path: '/personnelManage',
        icon: 'table',
        name: 'personnelManage',
        component: './PersonnelManage/TeacherManage',
      },
      {
        path: '/personnelManage/teacher-manage',
        name: 'teacherManage',
        component: './PersonnelManage/TeacherManage',
      },
      {
        path: '/personnelManage/student-manage',
        name: 'studentManage',
        component: './PersonnelManage/StudentManage',
      },
      {
        path: '/personnelManage/class-manage',
        name: 'classManage',
        component: './PersonnelManage/ClassManage',
      },
      {
        path: '/standbyVideoManage',
        icon: 'table',
        name: 'standbyVideoManage',
        component: './StandbyVideoManage/StandbyVideoManage',
      },
      {
        path: '/teachingManage',
        icon: 'table',
        name: 'teachingManage',
        component: './TeachingManage/ClassifiedManage',
      },
      {
        path: '/teachingManage/classified-manage',
        name: 'classifiedManage',
        component: './TeachingManage/ClassifiedManage',
      },
      {
        path: '/teachingManage/video-manage',
        name: 'videoManage',
        component: './TeachingManage/VideoManage',
      },
      {
        path: '/teachingManage/pic-manage',
        name: 'picManage',
        component: './TeachingManage/PicManage',
      },
      {
        path: '/teachingManage/audio-manage',
        name: 'audioManage',
        component: './TeachingManage/AudioManage',
      },
      {
        path: '/teachingManage/document-manage',
        name: 'documentManage',
        component: './TeachingManage/DocumentManage',
      },
      {
        path: '/displayBoardManage',
        icon: 'table',
        name: 'displayBoardManage',
        component: './DisplayBoardManage/TypeManage',
      },
      {
        path: '/displayBoardManage/type-manage',
        name: 'typeManage',
        component: './DisplayBoardManage/TypeManage',
      },
      {
        path: '/displayBoardManage/content-manage',
        name: 'contentManage',
        component: './DisplayBoardManage/ContentManage',
      },
      {
        path: '/itemBankManage',
        icon: 'table',
        name: 'itemBankManage',
        component: './ItemBankManage/KnowPointsManage',
      },
      {
        path: '/itemBankManage/know-points-manage',
        name: 'knowPointsManage',
        component: './ItemBankManage/KnowPointsManage',
      },
      {
        path: '/itemBankManage/item-manage',
        name: 'itemManage',
        component: './ItemBankManage/ItemManage',
      },
      {
        path: '/itemBankManage/custom-manage',
        name: 'customManage',
        component: './ItemBankManage/CustomManage',
      },
      {
        path: '/itemBankManage/group-manage',
        name: 'groupManage',
        component: './ItemBankManage/GroupManage',
      },
      {
        path: '/taskManage',
        icon: 'table',
        name: 'taskManage',
        component: './TaskManage/TaskManage',
      },
      {
        path: '/questionnaireInvestigation',
        icon: 'table',
        name: 'questionnaireInvestigation',
        component: './QuestionnaireInvestigation/QuestionnaireInvestigation',
      },
      {
        path: '/bluetoothManage',
        icon: 'table',
        name: 'bluetoothManage',
        component: './BluetoothManage/BluetoothManage',
      },
      {
        path: '/guideManage',
        icon: 'table',
        name: 'guideManage',
        component: './GuideManage/GuideManage',
      },
      {
        path: '/titleManage',
        icon: 'table',
        name: 'titleManage',
        component: './TitleManage/TitleManage',
      },
      {
        path: '/certificateManage',
        icon: 'table',
        name: 'certificateManage',
        component: './CertificateManage/CertificateManage',
      },
      {
        path: '/dataStatistics',
        icon: 'table',
        name: 'dataStatistics',
        component: './DataStatistics/VisitingStatistics',
      },
      {
        path: '/dataStatistics/visitingStatistics',
        name: 'visitingStatistics',
        component: './DataStatistics/VisitingStatistics',
      },
      {
        path: '/dataStatistics/capabilityStatistics',
        name: 'capabilityStatistics',
        component: './DataStatistics/CapabilityStatistics',
      },
      {
        path: '/fractionalRule',
        icon: 'table',
        name: 'fractionalRule',
        component: './FractionalRule/FractionalRule',
      },
        {
        path: '/alumnusManage',
        icon: 'table',
        name: 'alumnusManage',
        component: './AlumnusManage/AutographManage',
      },
      {
        path: '/alumnusManage/autograph-manage',
        name: 'autographManage',
        component: './AlumnusManage/AutographManage',
      },
      {
        path: '/alumnusManage/school-manage',
        name: 'schoolManage',
        component: './AlumnusManage/SchoolManage',
      },
      {
        path: '/alumnusManage/background-manage',
        name: 'backgroundManage',
        component: './AlumnusManage/BackgroundManage',
      },
      {
        component: '404',
      },
    ],
  },
];
