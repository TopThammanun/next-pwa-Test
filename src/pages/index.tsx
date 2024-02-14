import { Fragment, ReactElement, useState } from 'react'
import RootLayout from '@/layouts/root-layout';
import MainLayout from '@/layouts/main-layout';

type Props = {}

const Home = (props: Props) => {

  return (
    <Fragment>
      TEST PWA
    </Fragment >
  )
}
export default Home

Home.getLayout = (page: ReactElement) => {
  return (
    <Fragment>
      <RootLayout>
        <MainLayout>
          {page}
        </MainLayout>
      </RootLayout>
    </Fragment>
  );
};