import axios from 'axios';
import { withIronSessionSsr } from 'iron-session/next';
import type { GetServerSideProps, NextPage } from 'next';
import * as React from 'react';
import { Toaster } from 'react-hot-toast';
import { FiCheckCircle, FiTrash2, FiXCircle } from 'react-icons/fi';
import { Column } from 'react-table';
import { toast } from 'react-toastify';
import useSWR from 'swr';

import AnimatePage from '@/components/AnimatePage';
import Button from '@/components/buttons/Button';
import ReactTable from '@/components/ReactTable';
import Seo from '@/components/Seo';
import { COOKIE_OPTIONS } from '@/constant/cookie';
import { toastStyle } from '@/constant/toast';
import DashboardLayout from '@/dashboard/layout';
import clsxm from '@/lib/clsxm';

type Ktp = {
  uid: string;
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

type Data = {
  delete: string;
} & Ktp;

const Home: NextPage = () => {
  const { data, mutate } = useSWR<GetResult>('/api/admin/ktp');
  const [validateBtnDisabled, setValidateBtnDisabled] = React.useState(false);
  const [deleteBtnDisabled, setDeleteBtnDisabled] = React.useState(false);

  const onClickToggleValidate = React.useCallback(
    (uid: string) => {
      const ktp = data?.data.find((ktp) => ktp.uid === uid);
      if (ktp === undefined) {
        return;
      }
      toast.promise(
        axios.put(`/api/admin/ktp/${uid}`, { validated: !ktp.validated }),
        {
          pending: {
            render: () => {
              setValidateBtnDisabled(true);
              return 'Processing';
            },
          },
          success: {
            render: ({ data }) => {
              setValidateBtnDisabled(false);
              mutate();
              const validated = data?.data.data.validated as string;
              const uid = data?.data.data.uid as string;
              return `Done, user ${uid} is now ${
                validated ? 'validated' : 'invalidated'
              }`;
            },
          },
          error: {
            render: () => {
              setValidateBtnDisabled(false);
              return 'Error';
            },
          },
        }
      );
    },
    [data?.data, mutate]
  );

  const onClickDelete = React.useCallback(
    (uid: string) => {
      const ktp = data?.data.find((ktp) => ktp.uid === uid);
      if (ktp === undefined) {
        return;
      }
      toast.promise(axios.delete(`/api/admin/ktp/${uid}`), {
        pending: {
          render: () => {
            setDeleteBtnDisabled(true);
            return 'Processing';
          },
        },
        success: {
          render: ({ data }) => {
            setDeleteBtnDisabled(false);
            mutate();
            const uid = data?.data.data.uid as string;
            return `Done, user ${uid} is deleted`;
          },
        },
        error: {
          render: () => {
            setDeleteBtnDisabled(false);
            return 'Error';
          },
        },
      });
    },
    [data?.data, mutate]
  );

  const columns = React.useMemo<Column<Data>[]>(
    () => [
      {
        Header: 'UID',
        accessor: 'uid',
      },
      {
        Header: 'NIK',
        accessor: 'nik', // accessor is the "key" in the data
      },
      {
        Header: 'Nama',
        accessor: 'nama',
      },
      {
        Header: 'Kota',
        accessor: 'kota',
      },
      {
        Header: 'Provinsi',
        accessor: 'provinsi',
      },
      {
        Header: 'Tempat tanggal lahir',
        accessor: 'ttl',
      },
      {
        Header: 'Validation toggle',
        accessor: 'validated',
        Cell: (cell) => {
          const uid = cell.row.values.uid as string;
          return (
            <Button
              variant='light'
              className={clsxm(
                cell.value && 'text-red-500 hover:text-red-600',
                !cell.value && 'text-green-500 hover:text-green-600'
              )}
              disabled={validateBtnDisabled}
              onClick={() => {
                onClickToggleValidate(uid);
              }}
            >
              {cell.value ? (
                <FiXCircle className='mr-2' />
              ) : (
                <FiCheckCircle className='mr-2' />
              )}
              {cell.value ? ' Invalidate' : 'Validate'}
            </Button>
          );
        },
      },
      {
        Header: 'Delete',
        accessor: 'delete',
        Cell: (cell) => {
          const uid = cell.row.values.uid as string;
          return (
            <Button
              variant='light'
              className='text-red-500 hover:text-red-600'
              onClick={() => onClickDelete(uid)}
              disabled={deleteBtnDisabled}
            >
              <FiTrash2 />
            </Button>
          );
        },
      },
    ],
    [
      deleteBtnDisabled,
      onClickDelete,
      onClickToggleValidate,
      validateBtnDisabled,
    ]
  );

  return (
    <DashboardLayout>
      <Seo />
      <AnimatePage>
        {data && (
          <ReactTable
            data={data.data.map((ktp) => ({ ...ktp, delete: '' }))}
            columns={columns}
          />
        )}
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
