import React from 'react';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { useRouter } from 'next/navigation';
import Head from 'next/head';
const ForbiddenPage = () => {
    const router = useRouter();

    const goBack = () => {
        router.back();
    };

    const goHome = () => {
        router.push('/');
    };

    return (
        <div>
            <Head>
                <title>403 Forbidden - Access Denied</title>
    <meta name="description" content="You don't have permission to access this page" />
        </Head>

        <div className="flex justify-content-center align-items-center min-h-screen bg-gray-100">
    <Card className="w-full md:w-6 shadow-4 text-center p-5">
    <div className="mb-4 flex justify-content-center">
    <i className="pi pi-lock text-red-500" style={{ fontSize: '5rem' }}></i>
    </div>

    <h1 className="text-6xl font-bold text-red-500 m-0">403</h1>
        <h2 className="text-2xl text-900 mt-2 mb-4">Access Forbidden</h2>

    <p className="text-gray-600 line-height-3 mb-5">
        Sorry, you don't have permission to access this page.
    Please make sure you have the proper credentials or contact
    the administrator if you believe this is an error.
    </p>

    <div className="flex flex-column md:flex-row justify-content-center gap-3">
    <Button
        label="Go Back"
    icon="pi pi-arrow-left"
    className="p-button-primary"
    onClick={goBack}
    />
    <Button
    label="Return Home"
    icon="pi pi-home"
    className="p-button-secondary"
    onClick={goHome}
    />
    </div>
    </Card>
    </div>
    </div>
);
};

export default ForbiddenPage;