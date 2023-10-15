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

function Accept({
   store,
   selectedStore,
   setConfirmationDialogOpen,
   fetchData,
}) {
   const [selectedReason, setSelectedReason] = useState("");

   const handleAcceptClick = async () => {
      try {
         const response = await fetch(`${baseURL}/api/v1/owner/authorization`, {
            method: "PUT",
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify({ id: selectedStore }),
         });

         if (!response.ok) {
            throw new Error("에러");
         }

         setConfirmationDialogOpen(true);

         // 데이터를 다시 불러온 후에 모달 팝업을 열어 사용자에게 알림
         fetchData(); // 데이터를 다시 불러오는 함수 호출
      } catch (error) {
         console.error("Error:", error);
         console.log(selectedStore);
         console.log(typeof selectedStore);
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

         <div className="mar_acc">
            <span style={{ marginRight: "90px" }}>
               <span className="pad_first_span" style={{ marginRight: "8px" }}>
                  사업자 번호
               </span>
               <Typography
                  variant="body1"
                  style={{ display: "inline" }}
                  className="underline-text"
               >
                  {store.businessNumber}
               </Typography>
            </span>
         </div>
      </div>
   );
}

function Deny({ store }) {
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
               <span className="pad_first_span">사업자 번호</span>{" "}
               <span className="underline-text">{store.businessNumber}</span>
            </div>

            <div className="margin_div">
               <span className="pad_first_span">사유</span>{" "}
               <span style={{ marginLeft: "8px" }}>
                  <Select value={selectedReason} onChange={handleChangeReason}>
                     <MenuItem value="option1">
                        이미 가입된 회원입니다.
                     </MenuItem>
                     <MenuItem value="option2">
                        회원가입 대상이 아닙니다.
                     </MenuItem>
                     <MenuItem value="option3">
                        잘못된 사업자 번호입니다.
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
   const [selectedStore, setSelectedStudent] = useState(null);
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
            `${baseURL}/api/v1/owner/unauthorization`
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
               <Droppable droppableId="stores">
                  {provided => (
                     <List
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        subheader={<li />}
                     >
                        {data &&
                           data.map((store, index) => (
                              <Draggable
                                 key={store.id}
                                 draggableId={store.id.toString()}
                                 index={index}
                              >
                                 {provided => (
                                    <ListItem
                                       ref={provided.innerRef}
                                       {...provided.draggableProps}
                                       {...provided.dragHandleProps}
                                       button
                                       selected={store.id === selectedStore}
                                       onClick={() =>
                                          setSelectedStudent(store.id)
                                       }
                                    >
                                       <ListItemText
                                          primary={store.businessNumber}
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
         {selectedStore !== null && (
            <>
               <Accept
                  store={data.find(s => s.id === selectedStore)}
                  selectedStore={selectedStore}
                  setConfirmationDialogOpen={setConfirmationDialogOpen}
                  fetchData={fetchData} // fetchData 함수를 Accept 컴포넌트에 전달
               />
               <Deny store={data.find(s => s.id === selectedStore)} />
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
