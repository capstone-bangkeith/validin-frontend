import { withIronSessionSsr } from 'iron-session/next';
import type { GetServerSideProps, NextPage } from 'next';
import * as React from 'react';
import { Toaster } from 'react-hot-toast';
import { FiCheckCircle, FiTrash2, FiXCircle } from 'react-icons/fi';
import { Column } from 'react-table';

import AnimatePage from '@/components/AnimatePage';
import Button from '@/components/buttons/Button';
import ReactTable from '@/components/ReactTable';
import Seo from '@/components/Seo';
import { COOKIE_OPTIONS } from '@/constant/cookie';
import { toastStyle } from '@/constant/toast';
import DashboardLayout from '@/dashboard/layout';
import clsxm from '@/lib/clsxm';

const Home: NextPage = () => {
  const data = React.useMemo(
    () => [
      {
        nik: '3569696969696969',
        nama: 'kodek',
        kota: 'SURAKARTA',
        provinsi: 'JEMBER UTARA',
        ttl: 'JEMBER, 29-02-2020',
        jenis_kelamin: 'LAKI-LAKI',
        alamat: 'Jl. Suka suka',
        rt_rw: '006/009',
        kel_desa: 'Desa Kntl',
        kecamatan: 'BADARAWUHI',
        agama: 'CIANJUR',
        status_perkawinan: 'KAWIN SILANG',
        pekerjaan: 'PEKERJAAN',
        kewarganegaraan: 'WNI',
        delete: {},
        verify: {
          isVerified: true,
        },
      },
    ],
    []
  );

  const columns = React.useMemo<Column<typeof data[number]>[]>(
    () => [
      {
        Header: 'NIK',
        accessor: 'nik', // accessor is the "key" in the data
      },
      {
        Header: 'Nama',
        accessor: 'nama',
      },
      {
        accessor: 'delete',
        Header: 'Delete',
        Cell: () => (
          <Button variant='light' className='text-red-500 hover:text-red-600'>
            <FiTrash2 />
          </Button>
        ),
      },
      {
        accessor: 'verify',
        Header: 'Toggle Verifikasi',
        Cell: ({ cell }) => (
          <Button
            variant='light'
            className={clsxm(
              cell.value.isVerified && 'text-red-500 hover:text-red-600',
              !cell.value.isVerified && 'text-green-500 hover:text-green-600'
            )}
          >
            {cell.value.isVerified ? <FiXCircle /> : <FiCheckCircle />}
          </Button>
        ),
      },
    ],
    []
  );

  return (
    <DashboardLayout>
      <Seo />
      <AnimatePage>
        <ReactTable data={data} columns={columns} />
      </AnimatePage>
      <Toaster
        toastOptions={{
          style: toastStyle,
          loading: {
            iconTheme: {
              primary: '#eb2754',
              secondary: 'black',
            },
          },
        }}
      />
    </DashboardLayout>
  );
};

export const getServerSideProps: GetServerSideProps = withIronSessionSsr(
  async ({ req }) => {
    const user = req.session.user;

    if (!user || user?.admin !== true) {
      return {
        redirect: {
          destination: '/login',
          permanent: false,
        },
      };
    }

    return {
      props: {
        user: req.session.user,
      },
    };
  },
  COOKIE_OPTIONS
);

export default Home;
