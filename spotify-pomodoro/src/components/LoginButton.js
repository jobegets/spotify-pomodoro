import { useAuth0} from '@auth0/auth0-react';
import Login from './Login';

const LoginButton = () => {
  const { loginWithRedirect, isAuthenticated } = useAuth0();

  return (
    !isAuthenticated && (
        <button class = "px-4 py-2 text-sm rounded-2xl font-bold text-white border-2 border-secondary bg-secondary transition-all ease-in-out duration-300 hover:bg-transparent hover:text-secondary" onClick={() => loginWithRedirect()}>Log In</button>
    )
    );
}

export default LoginButton;