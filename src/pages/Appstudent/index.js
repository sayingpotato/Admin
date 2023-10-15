import { useState, useEffect } from "react";
import "./style.css";
import {
   Dialog,
   DialogTitle,
   DialogContent, // 추가해야 하는 부분
   List,
   ListItem,
   ListItemText,
   Select,
   MenuItem,
   TextField,
   Button,
   Typography,
} from "@mui/material";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

// api base url
const baseURL = "http://34.64.80.226:8080";

function ConfirmationDialog({ open, onClose }) {
   return (
      <Dialog open={open} onClose={onClose}>
         <DialogTitle>승인 완료</DialogTitle>
         <DialogContent>승인이 성공적으로 처리되었습니다.</DialogContent>
         <Button onClick={onClose} variant="contained">
            확인
         </Button>
      </Dialog>
   );
}

function ApplicationID({ student }) {
   return (
      <div className="pad">
         <div className="text_bold mar">신청 학생증</div>
         <img
            src={`${baseURL}/image/view?customerStoredImage=${student.customerImage.customerStoredImage}`}
            alt="학생증 이미지"
            style={{
               maxWidth: "100%",
               maxHeight: "200px",
               borderRadius: "0",
               display: "block", // 이미지를 가운데에 정렬하려면 block 요소로 만들어야 합니다.
               margin: "0 auto", // 가로 중앙 정렬을 위한 margin 설정
            }}
         />
      </div>
   );
}

function Accept({
   student,
   selectedStudent,
   setConfirmationDialogOpen,
   fetchData,
}) {
   const [selectedReason, setSelectedReason] = useState("");

   const handleAcceptClick = async () => {
      try {
         const response = await fetch(`${baseURL}/api/v1/customers/certify`, {
            method: "POST",
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify({ id: selectedStudent }),
         });

         if (!response.ok) {
            throw new Error("Network response was not ok");
         }

         // 성공적으로 처리된 경우 모달 팝업을 열어 사용자에게 알림
         setConfirmationDialogOpen(true);

         fetchData(); // 데이터를 다시 불러오는 함수 호출
      } catch (error) {
         console.error("Error:", error);
         // 오류 처리 로직을 여기에 추가
      }
   };

   const handleChangeReason = event => {
      setSelectedReason(event.target.value);
   };

   return (
      <div className="pad back_accept">
         <div className="button-container_b">
            <span className="text_bold">수락</span>
            <Button
               variant="contained"
               size="small"
               onClick={handleAcceptClick}
            >
               수락하기
            </Button>
         </div>
         <div className="mar_acc_a">
            <span>
               <span className="pad_first_span" style={{ marginRight: "8px" }}>
                  학교
               </span>
               <Typography
                  variant="body1"
                  style={{ display: "inline" }}
                  className="underline-text"
               >
                  {student.customerCollege}
               </Typography>
            </span>
         </div>

         <div className="mar_acc">
            <span style={{ marginRight: "90px" }}>
               <span className="pad_first_span" style={{ marginRight: "8px" }}>
                  학번
               </span>
               <Typography
                  variant="body1"
                  style={{ display: "inline" }}
                  className="underline-text"
               >
                  {student.customerNumber}
               </Typography>
            </span>
            <span>
               <span className="pad_first_span" style={{ marginRight: "8px" }}>
                  학과
               </span>
               <Typography
                  variant="body1"
                  style={{ display: "inline" }}
                  className="underline-text"
               >
                  {student.customerDept}
               </Typography>
            </span>
         </div>
      </div>
   );
}

function Deny({ student }) {
   const [selectedReason, setSelectedReason] = useState("");

   const handleChangeReason = event => {
      setSelectedReason(event.target.value);
   };

   return (
      <div className="pad back_deny">
         <div className="button-container">
            <span className="text_bold">거절</span>
            <Button variant="contained" color="error" size="small">
               거절하기
            </Button>
         </div>
         <div>
            <div className="margin_div">
               <span className="pad_first_span">ID</span>{" "}
               <span className="underline-text">{student.id}</span>
            </div>

            <div className="margin_div">
               <span className="pad_first_span">사유</span>{" "}
               <span style={{ marginLeft: "8px" }}>
                  <Select value={selectedReason} onChange={handleChangeReason}>
                     <MenuItem value="option1">
                        이미 가입된 회원입니다.
                     </MenuItem>
                     <MenuItem value="option2">
                        학생증 이미지가 부정확합니다.
                     </MenuItem>
                     <MenuItem value="option3">
                        회원가입 대상이 아닙니다.
                     </MenuItem>
                     <MenuItem value="option4">기타</MenuItem>
                  </Select>
               </span>
               {selectedReason === "option4" && (
                  <span style={{ marginLeft: "8px" }}>
                     <TextField
                        type="text"
                        label="🥹 거절 사유를 입력해 주세요 🥹"
                        size="small"
                        InputLabelProps={{
                           shrink: true,
                        }}
                     />
                  </span>
               )}
            </div>
         </div>
      </div>
   );
}

function Appstudent() {
   const [selectedStudent, setSelectedStudent] = useState(null);
   const [data, setData] = useState([]);
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState(null);
   const [confirmationDialogOpen, setConfirmationDialogOpen] = useState(false);

   const handleDragEnd = result => {
      if (!result.destination) return;
      const items = Array.from(data);
      const [reorderedItem] = items.splice(result.source.index, 1);
      items.splice(result.destination.index, 0, reorderedItem);
   };

   const handleRefreshClick = () => {
      fetchData(); // 데이터를 다시 불러오는 함수 호출
   };

   useEffect(() => {
      // 페이지가 로드될 때 데이터를 불러오도록 설정
      fetchData();
   }, []); // 빈 배열을 두 번째 매개변수로 전달하여 한 번만 실행되도록 설정

   // 데이터를 불러오는 함수 정의
   const fetchData = async () => {
      setLoading(true);
      try {
         const response = await fetch(
            `${baseURL}/api/v1/customers/unauthorizedCustomers`
         );
         if (!response.ok) {
            throw new Error("Network response was not ok");
         }
         const responseData = await response.json();
         // console.log(responseData); // 통신 확인
         setData(responseData.data);
         // console.log(responseData.data); // data 확인
         if (responseData.data.length > 0) {
            setSelectedStudent(responseData.data[0].id);
         }
         setLoading(false);
      } catch (error) {
         setError(error);
         setLoading(false);
      }
   };

   if (loading) {
      return <div>Loading...</div>;
   }

   if (error) {
      return (
         <div>
            <div>Error: {error.message}</div>
            <button onClick={handleRefreshClick}>다시 불러오기</button>
         </div>
      );
   }

   return (
      <div className="App">
         <div
            className="pad"
            style={{ overflow: "auto", maxHeight: "300px", width: "100%" }}
         >
            <div className="text_bold mar">신청 목록</div>
            <DragDropContext onDragEnd={handleDragEnd}>
               <Droppable droppableId="students">
                  {provided => (
                     <List
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        subheader={<li />}
                     >
                        {data &&
                           data.map((student, index) => (
                              <Draggable
                                 key={student.id}
                                 draggableId={student.id.toString()}
                                 index={index}
                              >
                                 {provided => (
                                    <ListItem
                                       ref={provided.innerRef}
                                       {...provided.draggableProps}
                                       {...provided.dragHandleProps}
                                       button
                                       selected={student.id === selectedStudent}
                                       onClick={() =>
                                          setSelectedStudent(student.id)
                                       }
                                    >
                                       <ListItemText
                                          primary={student.customerNumber}
                                          style={{
                                             textAlign: "center",
                                          }}
                                       />
                                    </ListItem>
                                 )}
                              </Draggable>
                           ))}
                        {provided.placeholder}
                     </List>
                  )}
               </Droppable>
            </DragDropContext>
         </div>
         {selectedStudent !== null && (
            <>
               <ApplicationID
                  student={data.find(s => s.id === selectedStudent)}
               />
               <Accept
                  student={data.find(s => s.id === selectedStudent)}
                  selectedStudent={selectedStudent}
                  setConfirmationDialogOpen={setConfirmationDialogOpen}
                  fetchData={fetchData} // fetchData 함수를 Accept 컴포넌트에 전달
               />
               <Deny student={data.find(s => s.id === selectedStudent)} />
            </>
         )}
         <ConfirmationDialog // 추가해야 하는 부분
            open={confirmationDialogOpen}
            onClose={() => setConfirmationDialogOpen(false)}
         />
      </div>
   );
}

export default Appstudent;
