import React from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import PrintSpravka from "./PrintSpravka";
import useAuth from "../../hooks/useAuth";

const fetchSpravkas = async ({ queryKey }) => {
    const axiosPrivate = queryKey[1];
    const id = queryKey[2];
    const response = await axiosPrivate.get(`/api/spravka/${id}`);
    return response.data;
};

const useFetchSpravkas = (axiosPrivate, id) => {
    return useQuery({
        queryKey: ["spravka", axiosPrivate, id],
        queryFn: fetchSpravkas,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
};

const ReadSpravka = () => {
    const { id } = useParams();
    const axiosPrivate = useAxiosPrivate();
    const { data: spravka, isLoading, isError } = useFetchSpravkas(axiosPrivate, id);

    if (isLoading) return <p>Загрузка...</p>;
    if (isError) return <p>Ошибка при загрузке данных</p>;

    return <PrintSpravka spravka={spravka} />;
};

export default ReadSpravka;