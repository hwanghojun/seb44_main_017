import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
`;
export const userTable = styled.li`
  display: flex;
  justify-content: space-around;
  align-items: center;
  border-bottom: 1px solid var(--color-gray200);
  padding: 16px 0px;
`;
export const userInfo = styled.span<{ name: string }>`
  width: 150px;
  text-align: center;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  cursor: pointer;
  @media (max-width: 940px) {
    width: 80px;
    display: ${(props) =>
      props.name === "email" || props.name === "phone" ? "none" : ""};
  }
`;
export const BanBtn = styled.button<{ isban: boolean }>`
  width: 80px;
  margin: 0px 35px;
  padding: 8px 0px;
  border: 0;
  border-radius: 16px;
  background-color: ${(props) => (props.isban ? "#FD3C3C" : "#42c45c")};
  color: white;
  @media (max-width: 940px) {
    margin: 0px;
  }
`;
export const Field = styled.div`
  display: flex;
  flex-direction: column;
  padding: 16px 36px;
  background-color: #f2f2f2;
  @media (min-width: 940px) {
    display: none;
  }
`;
export const FieldUserInfo = styled.p`
  margin: 8px 0px;
  white-space: nowrap;
  text-overflow: ellipsis;
  cursor: pointer;
`;
export const AgreeBtn = styled.button`
  padding: 8px 20px;
  border: 0;
  border-radius: 16px;
  color: white;
  background-color: #fd3c3c;
`;
export const CancelBtn = styled.button`
  padding: 8px 20px;
  border: 0;
  border-radius: 16px;
  color: black;
`;
