import React, { useState, useMemo } from "react";
import { useTable, useSortBy, useFilters, useGlobalFilter } from "react-table";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Box, TextField } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import useMediaQuery from "@mui/material/useMediaQuery";
import { GlobalFilter, DefaultColumnFilter } from "../../components/TableFilters";
import { BASE_URL } from "../../config";

import { useLocation, Navigate } from "react-router-dom";

import { useQuery } from "@tanstack/react-query";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import useAuth from "../../hooks/useAuth";
import { jwtDecode } from "jwt-decode";




const fetchSpravkas = async ({ queryKey }) => {
  const axiosPrivate = queryKey[1];
  const response = await axiosPrivate.get("/api/spravka");
  return response.data;
};

const useFetchSpravkas = (axiosPrivate) => {
  return useQuery({
    queryKey: ["spravkas", axiosPrivate],
    queryFn: fetchSpravkas,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

const MenuSpravka = () => {
  const axiosPrivate = useAxiosPrivate();
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const navigate = useNavigate();
  const location = useLocation();

  const { data: spravkas, isLoading, isError } = useFetchSpravkas(axiosPrivate);
  const [globalFilter, setGlobalFilter] = useState("");

  const { auth } = useAuth();
  const columns = useMemo(
    () => [
      {
        Header: "Дата",
        accessor: "date",
      },
      {
        Header: "Тип",
        accessor: "type",
      },
      {
        Header: "Пациент",
        accessor: "patient_name",
      },
      {
        Header: "Пациент ИИН",
        accessor: "patient_iin",
      },
      {
        Header: "Карточка",
        accessor: "id",
        Cell: ({ value }) => <Link to={`/spravka/read/${value}`} state={{ from: location }} replace>Открыть</Link> ,
      },
    ],
    []
  );

  const data = useMemo(() => spravkas || [], [spravkas]);

  const defaultColumn = useMemo(
    () => ({
      Filter: DefaultColumnFilter,
    }),
    []
  );

  const tableInstance = useTable(
    {
      columns,
      data,
      defaultColumn,
      initialState: { globalFilter },
    },
    useFilters,
    useGlobalFilter,
    useSortBy
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    setGlobalFilter: setTableGlobalFilter,
  } = tableInstance;

  if (isLoading) return <p>Загрузка...</p>;
  if (isError) return <p>Ошибка при загрузке данных</p>;

  
  const decoded = auth?.accessToken
  ? jwtDecode(auth.accessToken)
  : undefined;

  const doctorName = decoded?.UserInfo?.fullname || "noname";

  return (
    <>
      <Box m="40px 0 0 0" p="50px" bgcolor="#f8f8f8">
        <Header title={`Здравствуйте, ${doctorName} - это Меню Справок`} subtitle="Выберите необходимое действие" />
        <Button
          variant="contained"
          color="success"
          fullWidth
          sx={{ fontWeight: "900", height: "50px", fontSize: "18px" }}
          onClick={() => navigate("/spravka/create")}
        >
          Создать справку
        </Button>

        <Box sx={{ marginTop: 4 }}>
          <TextField
            fullWidth
            variant="outlined"
            label="Поиск"
            value={globalFilter}
            onChange={(e) => {
              setGlobalFilter(e.target.value);
              setTableGlobalFilter(e.target.value);
            }}
          />
        </Box>

        <TableContainer component={Paper} sx={{ marginTop: 4 }}>
		{data.length === 0 ? (
              <p>У вас пока нет созданных справок</p>
            ) : (
          <Table {...getTableProps()}>
            <TableHead>
              {headerGroups.map((headerGroup) => (
                <TableRow {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column) => (
                    <TableCell {...column.getHeaderProps(column.getSortByToggleProps())}>
                      {column.render("Header")}
                      <span>
                        {column.isSorted ? (column.isSortedDesc ? " 🔽" : " 🔼") : ""}
                      </span>
                      <div>{column.canFilter ? column.render("Filter") : null}</div>
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableHead>
            <TableBody {...getTableBodyProps()}>
              {rows.map((row) => {
                prepareRow(row);
                return (
                  <TableRow {...row.getRowProps()}>
                    {row.cells.map((cell) => (
                      <TableCell {...cell.getCellProps()}>{cell.render("Cell")}</TableCell>
                    ))}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
		  )}
        </TableContainer>

        
      </Box>
    </>
  );
};

export default MenuSpravka;
