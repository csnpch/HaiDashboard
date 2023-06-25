import {
    RouterProvider,
} from "react-router-dom";
import { routerBrowser } from './router';
import { Provider } from 'react-redux';
import { store } from './store/index.ts';
import { Helmet } from "react-helmet";

export default function App() {

    return (
        <>

            <Helmet>
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=1024"></meta>
            </Helmet>
    
            <Provider store={store}>
                <RouterProvider router={routerBrowser} />
            </Provider>
    
        </>
    )

}

