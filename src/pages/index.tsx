import { Fragment, ReactElement, useState, useCallback, useEffect } from 'react'
import RootLayout from '@/layouts/root-layout';
import MainLayout from '@/layouts/main-layout';
import { Button, Card, Input, Table, TableHeader, TableColumn, TableBody, TableCell, TableRow, Tooltip, Chip } from '@nextui-org/react';
import { Controller, useForm } from 'react-hook-form'
import { Person, PersonDb } from '@/types/person'
import { db } from "@/db/database.config";
import { useLiveQuery } from "dexie-react-hooks";
import { Icon } from '@iconify/react/dist/iconify.js';
import testPersonAPI from '@/api/testPerson'

type Props = {}

const Home = (props: Props) => {
  const [status, setStatus] = useState(navigator.onLine)
  const [personRealDbList, setPersonRealDbList] = useState<Person[]>([])
  const form = useForm<PersonDb>({
    defaultValues: {
      email: '',
      fname: '',
      lname: ''
    }
  });
  const getData = async () => {
    const res = await testPersonAPI.getAllData();
    if (res) {
      setPersonRealDbList(res);
    }
  }

  const onSubmit = async (req: PersonDb) => {
    try {
      if (!req?.id) {
        if (status) {
          const res = await testPersonAPI.createData({ data: req })
          if (res) getData();
        } else {
          const id = await db.persons.add(Object.assign(req, { status: 'offline' }));
        }
      } else if (req?.id) {
        await db.persons.put({
          id: req.id,
          email: req.email,
          fname: req.fname,
          lname: req.lname,
          status: 'offline'
        });
      }
    } catch (error) {
      console.error(`Failed to add : ${error}`);
    }
    form.reset();
  }

  const listPerson = useLiveQuery(
    () => db.persons.toArray(),
    []
  ) || [];

  const updateStudent = (item: PersonDb) => {
    try {
      const { id, email, fname, lname } = item;

      if (id !== undefined && email !== undefined && fname !== undefined && lname !== undefined) {
        form.setValue('id', id, { shouldDirty: true });
        form.setValue('email', email, { shouldDirty: true });
        form.setValue('fname', fname, { shouldDirty: true });
        form.setValue('lname', lname, { shouldDirty: true });
      } else {
        console.error('One or more fields are missing or have undefined values.');
      }
    } catch (error) {
      console.error(`Failed to add : ${error}`);
    }
  }

  const deleteStudent = async (id: any) => {
    try {
      await db.persons.delete(id);
    } catch (error) {
      console.error(`Failed to add : ${error}`);
    }
  }

  useEffect(() => {
    getData();
  }, [status]);

  useEffect(() => {
    const handleOnline = () => {
      setStatus(true);
    };
    const handleOffline = () => {
      setStatus(false);
    };
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    const updateStatus = async (element: PersonDb) => {
      if (element.status === 'offline') {
        await db.persons.put({
          id: element.id,
          email: element.email,
          fname: element.fname,
          lname: element.lname,
          status: 'waiting'
        });
        const res = await testPersonAPI.createData({
          data: {
            email: element.email,
            fname: element.fname,
            lname: element.lname,
          }
        })
        await deleteStudent(element.id)
        if (res) getData();
      };
    }
    const updateStatusForAllPersons = async () => {
      for (const element of listPerson) {
        await updateStatus(element);
      }
    };
    if (status) {
      updateStatusForAllPersons();
    }
  }, [status]);

  console.log("personRealDbList", personRealDbList);

  return (
    <Fragment>
      <div className='flex gap-2 justify-center'>
        {`Status : `}
        {
          status ? (<Chip color="success">Online</Chip>) : (<Chip color="danger">Offline</Chip>)
        }
      </div>
      <div className="flex flex-grow justify-center">
        <Card className="p-10 mt-5 mb-10">
          <div className='flex items-center gap-2 pb-1 mb-3 ml-1 w-full'>
            <h1 className='text-xl'>ตัวอย่างฟอร์ม</h1>
          </div>
          <form className='grid grid-cols-12 gap-6' onSubmit={form.handleSubmit(onSubmit)}>
            <div className='col-span-12 grid grid-cols-12 gap-6'>
              <Controller
                name="fname"
                control={form.control}
                render={({ field }) => <Input label="ชื่อ" placeholder=" " className='lg:col-span-6 col-span-12' {...field} />}
              />
              <Controller
                name="lname"
                control={form.control}
                render={({ field }) => <Input label="นามสกุล" placeholder=" " className='lg:col-span-6 col-span-12'  {...field} />}
              />
            </div>
            <Controller
              name="email"
              control={form.control}
              render={({ field }) => <Input label="Email" placeholder=" " className='col-span-12'  {...field} />}
            />
            <Button type="submit" color="primary" className='col-span-12'>Submit</Button>
          </form>
        </Card>
      </div>
      <div className='font-semibold mb-5'>Index DB</div>
      <Table
        aria-label="Example static collection table"
        selectionMode="single"
      >
        <TableHeader>
          <TableColumn>FNAME</TableColumn>
          <TableColumn>LNAME</TableColumn>
          <TableColumn>EMAIL</TableColumn>
          <TableColumn>ACTION</TableColumn>
          <TableColumn>STATUS DATA</TableColumn>
        </TableHeader>
        <TableBody items={listPerson}>
          {(item) => (
            <TableRow key={item.id}>
              <TableCell>{item.fname}</TableCell>
              <TableCell>{item.lname}</TableCell>
              <TableCell>{item.email}</TableCell>
              <TableCell>
                <div className="relative flex items-center gap-1">
                  <Button type="submit" color="secondary" className='col-span-12' isIconOnly variant='light' onClick={() => {
                    updateStudent(item)
                  }}>
                    <Icon icon="tabler:edit" className='w-5 h-5' />
                  </Button>
                  <Button type="submit" color="danger" className='col-span-12' isIconOnly variant='light' onClick={() => {
                    deleteStudent(item.id)
                  }}>
                    <Icon icon="ic:round-delete" className='w-5 h-5' />
                  </Button>
                </div>
              </TableCell>
              <TableCell>{item.status === "online" ? (<Chip color="success">Online</Chip>) : (item.status === "offline" ? <Chip color="danger">Offline</Chip> : <Chip color="warning"><Icon icon="mingcute:loading-fill" className='animate-spin' /></Chip>)}</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <div className='font-semibold my-5'>Real DB</div>
      <Table
        aria-label="Example static collection table"
        selectionMode="single"
      >
        <TableHeader>
          <TableColumn>FNAME</TableColumn>
          <TableColumn>LNAME</TableColumn>
          <TableColumn>EMAIL</TableColumn>
        </TableHeader>
        <TableBody items={personRealDbList}>
          {(item) => (
            <TableRow key={item?.id}>
              <TableCell>{item?.fname}</TableCell>
              <TableCell>{item?.lname}</TableCell>
              <TableCell>{item?.email}</TableCell>
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