import {isAxiosError} from 'axios';
export const errorMessage=(error:unknown,fallback:string)=>isAxiosError<{error?:string;message?:string}>(error)?error.response?.data?.error || error.response?.data?.message || fallback:error instanceof Error?error.message:fallback;
