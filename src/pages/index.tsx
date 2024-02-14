import { Fragment, ReactElement, useState } from 'react'
import RootLayout from '@/layouts/root-layout';
import MainLayout from '@/layouts/main-layout';
import { Button, Card, Input, Table, TableHeader, TableColumn, TableBody, TableCell, TableRow } from '@nextui-org/react';
import { useForm } from 'react-hook-form'
import { Person, PersonDb } from '@/types/person'
import { db } from "@/db/database.config";
import { useLiveQuery } from "dexie-react-hooks";

type Props = {}

const Home = (props: Props) => {
  const form = useForm<Person>();
  const onSubmit = async (req: Person) => {
    try {
      const id = await db.persons.add(req);
      console.info(`new Person ${id}`);
    } catch (error) {
      console.error(`Failed to add : ${error}`);
    }
  }

  const listPerson = useLiveQuery(
    () => db.persons.toArray(),
    []
  ) || [];

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
      <Table
        aria-label="Example static collection table"
        selectionMode="single"
      >
        <TableHeader>
          <TableColumn>FNAME</TableColumn>
          <TableColumn>LNAME</TableColumn>
          <TableColumn>EMAIL</TableColumn>
        </TableHeader>
        <TableBody items={listPerson}>
          {(item) => (
            <TableRow key={item.id}>
              <TableCell>{item.fname}</TableCell>
              <TableCell>{item.lname}</TableCell>
              <TableCell>{item.email}</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
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