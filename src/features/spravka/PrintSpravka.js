import { useRef } from "react";
import QRCode from "../../features/qrcodes/QRCode";
import { BASE_URL } from "../../config";
import ReactToPrint from "react-to-print";
import { Link, useNavigate } from "react-router-dom";

import Header from "../../components/Header";
import {
    Box,
    Button
  } from "@mui/material";

const PrintSpravka = ({ spravka }) => {
    const componentRef = useRef();

    return (
        <>
            <Box m="20px">
                <Header
                    title="Справка готова!"
                    subtitle="Информация о справке представлена ниже."
                />

                <div ref={componentRef} className="printable-component">
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <div style={{ marginRight: '20px' }}>
                            <QRCode url={`${BASE_URL}/${spravka?._id}`} isImage={true} isButton={false} />
                        </div>
                        <div>
                            <h3 fontSize="18px">ТОО «Медицинская фирма "Гиппократ"»</h3>
                            <p style={{ fontSize: '14px' }}>
                                <b>Вид справки:</b> {spravka?.type} <br />
                                <b>ИИН:</b> {spravka.patient_iin} <br />
                                <b>Пациенту:</b> {spravka?.patient_name} <br />
                                <b>Выдал:</b> {spravka?.doctor_name} <br />
                                <b>Дата:</b> {spravka?.date} <br />
                            </p>
                        </div>
                    </div>
                </div>

                <ReactToPrint
                    trigger={() => <Button style={{ marginTop: '10px' }} variant="contained">Распечатать справку</Button>}
                    content={() => componentRef.current}
                />

                <p>
                    <span className="line">
                        <Link to="/spravka">Назад</Link>
                    </span>
                </p>
            </Box>
        </>
    );
};

export default PrintSpravka;