import Document, {Head, Main, NextScript} from 'next/document';


export default class MyDocument extends Document {
    render() {
        return (
            <html>
            <Head>
                <meta charSet="UTF-8"/>
                <meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no"/>
                <meta httpEquiv="X-UA-Compatible" content="IE=Edge"/>
                <meta name="apple-mobile-web-app-capable" content="yes"/>
                {/* <link href="https://fonts.googleapis.com/css?family=Roboto" rel="stylesheet"/> */}
                <link rel="stylesheet" href="https://handy-cdn-staging.s3.amazonaws.com/baseline/dist/stylesheets/handyBaseline.css" />
                <link href="/_next/static/style.css" rel="stylesheet"/>
            </Head>
            <body>
            <Main/>
            <NextScript/>
            </body>
            </html>
        )
    }
}
