import { withIronSessionSsr } from 'iron-session/next';
import type { GetServerSideProps, NextPage } from 'next';
import * as React from 'react';
import { Toaster } from 'react-hot-toast';
import { Column } from 'react-table';
import useSWR from 'swr';

import AnimatePage from '@/components/AnimatePage';
import ReactTable from '@/components/ReactTable';
import Seo from '@/components/Seo';
import { COOKIE_OPTIONS } from '@/constant/cookie';
import { toastStyle } from '@/constant/toast';
import DashboardLayout from '@/dashboard/layout';

type Ktp = {
  nama: string;
  nik: string;
  kota: string;
  provinsi: string;
  ttl: string;
  jenis_kelamin: string;
  alamat: string;
  rt_rw: string;
  kel_desa: string;
  kecamatan: string;
  agama: string;
  status_perkawinan: string;
  pekerjaan: string;
  kewarganegaraan: string;
  validated: boolean;
};

type GetResult = {
  data: Ktp[];
};

const Home: NextPage = () => {
  const { data } = useSWR<GetResult>('/api/admin/ktp');

  const columns = React.useMemo<Column<Ktp>[]>(
    () => [
      {
        Header: 'NIK',
        accessor: 'nik', // accessor is the "key" in the data
      },
      {
        Header: 'Nama',
        accessor: 'nama',
      },
    ],
    []
  );

  return (
    <DashboardLayout>
      <Seo />
      <AnimatePage>
        {data && <ReactTable data={data.data} columns={columns} />}
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
