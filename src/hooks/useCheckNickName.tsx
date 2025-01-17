import { useCallback, useMemo, useState } from "react";
import { debounce } from "lodash";
import { checkNicknameDuplication } from "@/redux/userSlice.ts";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store.ts";

export const useCheckNickName = () => {
  const [validationText, setValidationText] = useState<string>("");

  const dispatch = useDispatch<AppDispatch>();
  const { isNicknameExist } = useSelector((state: RootState) => state.user);

  const validationNickname = useCallback(
    (nickname: string) => {
      if (nickname.length < 2 || nickname.length > 7) {
        setValidationText("최소 2자에서 최대 7자로 입력해주세요.");
      } else if (isNicknameExist) {
        setValidationText("이미 사용 중인 닉네임 입니다.");
      } else {
        setValidationText("사용 가능한 닉네임 입니다!");
      }
    },
    [isNicknameExist]
  );

  const debouncedCheckNickname = useMemo(
    () =>
      debounce((nickname: string) => {
        if (nickname.length >= 2 && nickname.length <= 7) {
          dispatch(checkNicknameDuplication(nickname));
        }
      }, 300),
    [dispatch]
  );

  return { validationText, validationNickname, debouncedCheckNickname };
};
