import { useRef, useState, useEffect } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { Link, Navigate } from "react-router-dom";
import { toast } from "react-toastify";
import Header from "../../components/Header";

import { jwtDecode } from "jwt-decode";
import useAuth from "../../hooks/useAuth";

import PrintSpravka from "./PrintSpravka";
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
  TextField,
  Box,
  Button
} from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";

const CREATESPRAVKA_URL = "/api/spravka";


const SpravkaForm = ({ handleSubmit, errMsg, setErrMsg }) => {
  const [type, setType] = useState("Гигиеническое обучение");
  const [firstname, setFirstname] = useState("");
  const [secondname, setSecondname] = useState("");
  const [middlename, setMiddlename] = useState("");
  const [iin, setIin] = useState("");

  const isNonMobile = useMediaQuery("(min-width:600px)");
  const userRef = useRef();
  const errRef = useRef();

  useEffect(() => {
      if (userRef.current) {
          userRef.current.focus();
      }
  }, []);

  useEffect(() => {
      setErrMsg("");
  }, [firstname, secondname, middlename, iin]);

  const onSubmit = (e) => {
      e.preventDefault();
      handleSubmit({ type, firstname, secondname, middlename, iin });
  };

  return (
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
              <form onSubmit={onSubmit}>
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
                          id="iin"
                          sx={{ gridColumn: "span 2" }}
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
                          id="secondname"
                          sx={{ gridColumn: "span 2" }}
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
                          id="firstname"
                          sx={{ gridColumn: "span 2" }}
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
                          id="middlename"
                          sx={{ gridColumn: "span 2" }}
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
                      size="large" type="submit" sx={{ margin: "20px 0", fontWeight: "900", height: "50px", fontSize: "18px" }}>
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
  );
};

const CreateSpravka = () => {
  const axiosPrivate = useAxiosPrivate();
  // const navigate = useNavigate();

  const [spravka, setSpravka] = useState(null);
  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);

  const { auth } = useAuth();

  const handleSubmit = async (formData) => {
      const { type, firstname, secondname, middlename, iin } = formData;
      
      if (!/^\d{12}$/.test(iin)) {
          setErrMsg("ИИН должен содержать ровно 12 цифр.");
          return;
      }

      try {
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

          setSpravka(result.data);

          toast.success("Справка создана", {
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
      } catch (err) {
          if (!err?.response) {
              setErrMsg("No Server Response");
          } else {
              setErrMsg("Addition Failed");
          }
      }
  };

  return (
      <>
          {success 
          ? <Navigate to={`/spravka/read/${spravka?._id}`} replace /> 
          : <SpravkaForm
                  handleSubmit={handleSubmit}
                  errMsg={errMsg}
                  setErrMsg={setErrMsg}
              />
          }
      </>
  );
};


export default CreateSpravka;
