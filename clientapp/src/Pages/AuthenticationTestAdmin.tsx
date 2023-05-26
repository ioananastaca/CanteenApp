import { withAdminAuth } from "../HOC";

function AuthenticationTestAdmin() {
  return (
    <div>Pagina accesata de admin</div>
  )
}

export default withAdminAuth(AuthenticationTestAdmin);