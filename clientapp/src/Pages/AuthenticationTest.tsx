import React from 'react'
import { withAuth } from "../HOC";

function AuthenticationTest() {
  return (
    <div>Pagina accesata de user neautentificat</div>
  )
}
export default withAuth(AuthenticationTest);