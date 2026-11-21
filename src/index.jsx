import React                    from 'react'
import ReactDOM                 from 'react-dom/client'
import { 
  createBrowserRouter, 
  RouterProvider 
}                               from 'react-router'
import { UserProvider }         from './App/components/UserProvider'
import ContentCampus            from './App/components/ContentCampus'
import Template                 from './App/template/Template'
import TemplateCampus           from './App/template/TemplateCampus'
import './index.css'

import Home                     from './App/pages/Home'

import NotFound                 from './App/pages/NotFound'

import WhoWeAre                  from './App/pages/WhoWeAre'

import Register                 from './App/pages/Register'
import Login                    from './App/pages/Login'
import Success                  from './App/pages/Success'
import Help                     from './App/pages/Help'
import FAQ                      from './App/pages/FAQ'
import ForgetPassw              from './App/pages/ForgetPassw'
import ResetPassw               from './App/pages/ResetPassw'

/*Protected */
import PublicRoute              from './App/components/PublicRoute'
import ProtectedRoute           from './App/components/ProtectedRoute'
import Profile                  from './App/pages/protected/Profile'
import ProfileEdit              from './App/pages/protected/ProfileEdit'
import Wellcome                 from './App/pages/protected/Wellcome'
import Configuration            from './App/pages/protected/Configuration'
import ConfigurationEdit        from './App/pages/protected/ConfigurationEdit'
import PrivacyPolitic           from './App/pages/PrivacyPolitic'

import { CONFIG_PATHS }         from './App/config/config'
import Courses                  from './App/pages/Courses'
import Formation                from './App/pages/Formation'
import DisciplineDetail         from './App/pages/DisciplineDetail'

import Campus                   from './App/pages/protected/campus/Campus'
import ProfessorAssing          from './App/pages/protected/campus/ProfessorAssing'
import ManageStudents           from './App/pages/protected/campus/ManageStudents'
import ManageCommissions        from './App/pages/protected/campus/ManageCommissions'
import ManageCampus             from './App/pages/protected/campus/ManageCampus'

import MattersListProfessor     from './App/components/MattersListProfessor'

import MyCourseDetail           from './App/pages/protected/campus/MyCourseDetail'
import MyCourses                from './App/pages/protected/campus/MyCourses'
import MyCoursesId              from './App/pages/protected/campus/MyCoursesId'
import CourseInscriptions       from './App/pages/protected/campus/CourseInscriptions'

import ManageSports             from './App/pages/protected/campus/ManageSports'
import ExamView                 from './App/components/ExamView'
import TokenExpired             from './App/pages/TokenExpired'
import ManageMatters            from './App/pages/protected/campus/ManageMatters'
import VerifyAccount            from './App/components/VerifyAccount'
import ManagePassword           from './App/pages/protected/campus/ManagePassword'
import ManageDownloadFile       from './App/pages/protected/campus/ManageDownloadFile'
import ManageGeneral            from './App/pages/protected/campus/ManageGeneral'
import Inscription              from './App/pages/Inscription'
import Contact                  from './App/pages/Contact'

const routes = [
  {
    path: "/",
    element: <Template />,
    children: [
      { path: CONFIG_PATHS.HOME_PATH,                                       element: <PublicRoute>       <Home/>                       </PublicRoute> },
      { path: CONFIG_PATHS.COURSES_PATH,                                    element: <PublicRoute>       <Courses/>                    </PublicRoute> },
      { path: CONFIG_PATHS.COURSES_PATH+"/disciplina/:id_discipline",       element: <PublicRoute>       <DisciplineDetail/>           </PublicRoute> },
      { path: CONFIG_PATHS.FORMATION_PATH,                                  element: <PublicRoute>       <Formation/>                  </PublicRoute> },
      { path: CONFIG_PATHS.INSCRIPTION_PATH,                                element: <PublicRoute>       <Inscription />               </PublicRoute> },      
      { path: CONFIG_PATHS.LOGIN_PATH,                                      element: <PublicRoute>       <Login/>                      </PublicRoute> },
      { path: CONFIG_PATHS.FORGET_PASSW_PATH,                               element: <PublicRoute>       <ForgetPassw/>                </PublicRoute> },
      { path: CONFIG_PATHS.RESET_PASSW,                                     element: <PublicRoute>       <ResetPassw/>                 </PublicRoute> },
      { path: CONFIG_PATHS.TOKEN_EXPIRED_PATH,                              element: <PublicRoute>       <TokenExpired/>               </PublicRoute> },
      //Publico y privado
      { path: CONFIG_PATHS.SUCCESS_PATH,                                    element: <Success />                                                      },
      { path: CONFIG_PATHS.WHO_WE_ARE_PATH,                                 element: <WhoWeAre/>                                                      },
      { path: CONFIG_PATHS.PRIVACY_PATH,                                    element: <PrivacyPolitic/>                                                },
      { path: CONFIG_PATHS.CERTIFICATES,                                    element: <FAQ/>                                                           },
      { path: CONFIG_PATHS.FAQ_PATH,                                        element: <FAQ/>                                                           },
      { path: CONFIG_PATHS.CONTACT_PATH,                                    element: <Contact />                                                      },
      //CONTACT_PATH
      { path: "*",                                                          element: <NotFound/>                                                      },
      { path: CONFIG_PATHS.REGISTER_PATH,                                   element: <PublicRoute>        <Register/>               </PublicRoute>    },
    ]
  },
  {  
    path: "/",
    element: <Template />,
    children: [
      { path: "verificar-cuenta",                                           element: <PublicRoute>       <VerifyAccount/>           </PublicRoute>    },      
    ]
  },
  { 
    path: "/campus",
    element: <TemplateCampus separator={false}/>,
    children: [
      { path: "",                                                           element: <ProtectedRoute>    <Campus/>                  </ProtectedRoute> },
      { path: CONFIG_PATHS.YOUR_WELLCOME_PATH,                              element: <ProtectedRoute>    <Wellcome/>                </ProtectedRoute> },
      
      /* --- BLOQUE DE GESTIÓN UNIFICADO CON LAYOUT PERSISTENTE --- */
      {
        element: <ContentCampus separator={false}/>,
        children: [
          { path: "gestion-comisiones",                                     element: <ProtectedRoute>   <ManageCommissions/>        </ProtectedRoute> },
          { path: "gestion-profesores",                                     element: <ProtectedRoute>   <ProfessorAssing/>          </ProtectedRoute> },
          { path: "gestion-alumnos",                                        element: <ProtectedRoute>   <ManageStudents/>           </ProtectedRoute> },
          { path: "gestion-deportes-disciplinas",                           element: <ProtectedRoute>   <ManageSports/>             </ProtectedRoute> },
          { path: "gestion-materias",                                       element: <ProtectedRoute>   <ManageMatters/>            </ProtectedRoute> },
          { path: "gestion-token",                                          element: <ProtectedRoute>   <ManageCampus />            </ProtectedRoute> },
          { path: "gestion-contraseña",                                     element: <ProtectedRoute>   <ManagePassword />          </ProtectedRoute> },
          { path: "gestion-descargar-archivos",                             element: <ProtectedRoute>   <ManageDownloadFile />      </ProtectedRoute> },
          { path: "gestion-general",                                        element: <ProtectedRoute>   <ManageGeneral />           </ProtectedRoute> },
          { path: "perfil/editar-perfil",                                   element: <ProtectedRoute>   <ProfileEdit/>              </ProtectedRoute> },
          { path: "configuracion/editar-configuracion",                     element: <ProtectedRoute>   <ConfigurationEdit/>        </ProtectedRoute> },
          { path: "editar-materia",                                         element: <ProtectedRoute>   <ManageGeneral />           </ProtectedRoute> },
          { path: CONFIG_PATHS.CAMPUS_PROFILE_PATH,                         element: <ProtectedRoute>   <Profile/>                  </ProtectedRoute> },
          { path: CONFIG_PATHS.CAMPUS_CONFIG_PATH,                          element: <ProtectedRoute>   <Configuration/>            </ProtectedRoute> },
          { path: CONFIG_PATHS.CAMPUS_HELP_PATH,                            element: <Help/>                                                          },
        ]
      },
      //Profesores:
      { 
        path: "profesor-cursos", // O tu constante correspondiente
        element: <ContentCampus separator={false}/>,
        children: [ 
          { path: "",                                                       element: <ProtectedRoute>  <MattersListProfessor/>      </ProtectedRoute> },
          { path: "detalles/:id",                                           element: <ProtectedRoute>  <MyCourseDetail/>            </ProtectedRoute> },
        ]
      },
      //Alumnos:
      { path: "exam/take/:id_exam",                                         element: <ProtectedRoute>  <ExamView/>                  </ProtectedRoute> },
      { 
        path: "mis-cursos", // Asegúrate de que coincida con lo que usas en el Link
        element: <ContentCampus separator={false}/>,
        children: [
          { path: "",                                                       element: <ProtectedRoute>  <MyCourses/>                 </ProtectedRoute> },
          { path: ":id",                                                    element: <ProtectedRoute>  <MyCoursesId/>               </ProtectedRoute> },
          { path: "detalles/:id",                                           element: <ProtectedRoute>  <MyCourseDetail/>            </ProtectedRoute> },
        ]
      },
      { 
        path: "inscribirme-a-cursos",
        element: <ContentCampus separator={false}/>,
        children: [
          { path: "",                                                       element: <ProtectedRoute>  <CourseInscriptions/>     </ProtectedRoute>     },
        ]
      }
    ]
  },
]
const router = createBrowserRouter(routes)

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
      <UserProvider>
        <RouterProvider router={router}/>
      </UserProvider>
  </React.StrictMode>
)