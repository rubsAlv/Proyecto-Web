
import Alumnos from "./src/pages/AppAlumnos";
import Carreras from "./src/pages/AppCarreras";
import Materias from "./src/pages/AppMaterias";
import Profesores from "./src/pages/AppProfesores";
import Salones from "./src/pages/AppSalones";

const routes = [
  {
    path: '/',
    component: (
      <>
         <Alumnos />
    </>
    ),
  },
  {
    path: '/Carreras',
    component: (
      <>
         <Carreras />
    </>
    ),
  },
  {
    path: '/Materias', 
    component: (
      <>
        <Materias />
      </>
    ),
  },
  {
    path: '/Profesores',
    component: (
      <>
         <Profesores />
      </>
    ),
  },
  {
    path: '/salones',
    component: <Salones />,
  }
];


export default routes;
