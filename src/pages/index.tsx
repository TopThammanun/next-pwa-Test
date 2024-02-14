import { Fragment, ReactElement, useState } from 'react'
import RootLayout from '@/layouts/root-layout';
import MainLayout from '@/layouts/main-layout';
import { Button, Card, Input } from '@nextui-org/react';
import { useForm } from 'react-hook-form'

type Props = {}

const Home = (props: Props) => {
  type formProps = {
    email: string,
    fname: string,
    lname: string
  }
  const form = useForm<formProps>();

  const onSubmit = async (req: formProps) => {
    console.log(req);
  }

  return (
    <Fragment>
      <div className="flex flex-grow justify-center">
        <Card className="p-10 my-10">
          <div className='flex items-center gap-2 pb-1 mb-3 ml-1 w-full'>
            <h1 className='text-xl'>ตัวอย่างฟอร์ม</h1>
          </div>
          <form className='grid grid-cols-12 gap-6' onSubmit={form.handleSubmit(onSubmit)}>
            <div className='col-span-12 grid grid-cols-12 gap-6'>
              <Input label="ชื่อ" placeholder="ระบุชื่อ" className='lg:col-span-6 col-span-12'  {...form.register('fname')} />
              <Input label="นามสกุล" placeholder="ระบุนามสกุล" className='lg:col-span-6 col-span-12'  {...form.register('lname')} />
            </div>
            <Input label="Email" placeholder="ระบุอีเมล์" className='col-span-12'  {...form.register('email')} />
            <Button type="submit" color="primary" className='col-span-12'>Submit</Button>
          </form>
        </Card>
      </div>
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