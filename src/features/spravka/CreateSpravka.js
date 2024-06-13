import { useRef, useState, useEffect } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import { TextField } from "@mui/material";
import { Box } from "@mui/material";
import Header from "../../components/Header";
import useMediaQuery from "@mui/material/useMediaQuery";
import QRCode from "../../features/qrcodes/QRCode";
import { BASE_URL } from "../../config";
import ReactToPrint from "react-to-print";
import { jwtDecode } from "jwt-decode";
import useAuth from "../../hooks/useAuth";

import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Input,
  InputAdornment,
  IconButton,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button
} from "@mui/material";

const CREATESPRAVKA_URL = "/api/spravka";

const CreateSpravka = () => {
  const axiosPrivate = useAxiosPrivate();
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const navigate = useNavigate();
  const userRef = useRef();
  const errRef = useRef();

  const [type, setType] = useState("Гигиеническое обучение");
  const [firstname, setFirstname] = useState("");
  const [secondname, setSecondname] = useState("");
  const [middlename, setMiddlename] = useState("");
  const [iin, setIin] = useState("");

  const [spravka, setSpravka] = useState("");

  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);

  const componentRef = useRef();
  const { auth } = useAuth();

  useEffect(() => {
    if (userRef.current) {
      userRef.current.focus();
    }
  }, []);

  useEffect(() => {
    setErrMsg("");
  }, [firstname, secondname, middlename, iin]);

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      if (!/^\d{12}$/.test(iin)) {
        setErrMsg("ИИН должен содержать ровно 12 цифр.");
        return;
      }

      // Get the current date
      const currentDate = new Date().toLocaleDateString('ru-RU');
      const decoded = auth?.accessToken
        ? jwtDecode(auth.accessToken)
        : undefined;
    
      const doctorName = decoded?.UserInfo?.fullname || "noname";
      const result = await axiosPrivate.post(CREATESPRAVKA_URL, {
        date: currentDate,
        type: type,
        patient_iin: iin,
        patient_firstname: firstname,
        patient_secondname: secondname,
        patient_middlename: middlename,
        doctor_name: doctorName,
      });
      console.log(result);
      setSpravka(result.data);

      toast.success("Спарвка создана", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "primary",
      });
      setSuccess(true);
      //clear state and controlled inputs
      setType("");
      setFirstname("");
      setSecondname("");
      setMiddlename("");
      // setIin("");
    } catch (err) {
      if (!err?.response) {
        setErrMsg("No Server Response");
      } else {
        setErrMsg("Addition Failed");
      }
      errRef.current.focus();
    }
  };


  return (
    <>
      {success ? (
        <>
        <p
            ref={errRef}
            className={errMsg ? "errmsg" : "offscreen"}
            aria-live="assertive"
          >
            {errMsg}
          </p>
          <Box m="20px">
            <Header
              title="Справка готова!"
              subtitle="Информация о справке представлена ниже."
            />

          <div ref={componentRef} className="printable-component" >
             <div style={{ display: 'flex', alignItems: 'center'}}>
              <div style={{ marginRight: '20px' }}>
                    <QRCode url={`${BASE_URL}/${spravka?._id}`} isImage={true} isButton={false} />
                </div>
                <div>
                    <h3 fontSize="18px">ТОО «Медицинская фирма "Гиппократ"»</h3>
                    <p style={{fontSize: '14px'}}>
                      <b>Вид справки:</b> {spravka?.type} <br />
                      <b>ИИН:</b> {iin} <br />
                      <b>Пациенту:</b> {spravka?.patient_secondname} {spravka?.patient_firstname.charAt(0)}. {spravka?.patient_middlename.charAt(0)}. <br/>
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



      ) : (
        <>
          <p
            ref={errRef}
            className={errMsg ? "errmsg" : "offscreen"}
            aria-live="assertive"
          >
            {errMsg}
          </p>
          <Box m="40px 0 0 0" p="50px" bgcolor="#f8f8f8">
            <Header
              title="Создать справку"
              subtitle="Форма заполнения данных о пациенте"
            />
            <form onSubmit={handleSubmit}>
              <Box
                display="grid"
                gap="10px"
                gridTemplateColumns="repeat(2, minmax(0, 1fr))"
                sx={{
                  "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
                }}
              >
                <FormControl fullWidth variant="filled">
                  <InputLabel htmlFor="type">Категория:</InputLabel>
                  <Select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    inputProps={{
                      name: "type",
                      id: "type",
                    }}
                  >
                    <MenuItem value="Гигиеническое обучение 1">Гигиеническое обучение №1</MenuItem>
                    <MenuItem value="Гигиеническое обучение 2">Гигиеническое обучение №2</MenuItem>
                    <MenuItem value="Гигиеническое обучение 3">Гигиеническое обучение №3</MenuItem>
                    <MenuItem value="Гигиеническое обучение 4">Гигиеническое обучение №4</MenuItem>
                    <MenuItem value="Гигиеническое обучение 5">Гигиеническое обучение №5</MenuItem>
                    <MenuItem value="Гигиеническое обучение 6">Гигиеническое обучение №6</MenuItem>
                    <MenuItem value="Осмотр терапевта">Осмотр терапевта</MenuItem>
                  </Select>
                </FormControl>

                <TextField
                  fullWidth
                  variant="filled"
                  type="text"
                  id="name"
                  sx={{ gridColumn: "span 2"}}
                  inputRef={userRef}
                  autoComplete="off"
                  multiline
                  rows={2}
                  onChange={(e) => setIin(e.target.value)}
                  value={iin}
                  required
                  label="ИИН пациента:"
                  InputLabelProps={{
                    shrink: true, // Сокращать метку, чтобы она не перекрывала текст при вводе
                  }}
                  inputProps={{
                    style: {
                      fontSize: "16px", // Замените на нужный вам размер шрифта
                    }
                  }}
                />
                <TextField
                  fullWidth
                  variant="filled"
                  type="text"
                  id="name"
                  sx={{ gridColumn: "span 2"}}
                  inputRef={userRef}
                  autoComplete="off"
                  multiline
                  rows={2}
                  onChange={(e) => setSecondname(e.target.value)}
                  value={secondname}
                  required
                  label="Фамилия пациента:"
                  InputLabelProps={{
                    shrink: true, // Сокращать метку, чтобы она не перекрывала текст при вводе
                  }}
                  inputProps={{
                    style: {
                      fontSize: "16px", // Замените на нужный вам размер шрифта
                    }
                  }}
                />
                <TextField
                  fullWidth
                  variant="filled"
                  type="text"
                  id="name"
                  sx={{ gridColumn: "span 2"}}
                  inputRef={userRef}
                  autoComplete="off"
                  multiline
                  rows={2}
                  onChange={(e) => setFirstname(e.target.value)}
                  value={firstname}
                  required
                  label="Имя пациента:"
                  InputLabelProps={{
                    shrink: true, // Сокращать метку, чтобы она не перекрывала текст при вводе
                  }}
                  inputProps={{
                    style: {
                      fontSize: "16px", // Замените на нужный вам размер шрифта
                    }
                  }}
                />
                <TextField
                  fullWidth
                  variant="filled"
                  type="text"
                  id="name"
                  sx={{ gridColumn: "span 2"}}
                  inputRef={userRef}
                  autoComplete="off"
                  multiline
                  rows={2}
                  onChange={(e) => setMiddlename(e.target.value)}
                  value={middlename}
                  required
                  label="Отчество пациента:"
                  InputLabelProps={{
                    shrink: true, // Сокращать метку, чтобы она не перекрывала текст при вводе
                  }}
                  inputProps={{
                    style: {
                      fontSize: "16px", // Замените на нужный вам размер шрифта
                    }
                  }}
                />

                

              </Box>
              <Button variant="contained" color="error"
                size = "large" type = "submit" sx = {{margin: "20px 0", fontWeight: "900", height: "50px", fontSize: "18px"}}>
                Создать справку
              </Button>
            </form>
            <p>
              <span className="line">
                <Link to="/spravka">Отмена</Link>
              </span>
            </p>
          </Box>
        </>
      )}
    </>
  );
};

export default CreateSpravka;
