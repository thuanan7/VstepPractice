import {Box} from "@mui/material";
import {useEffect} from "react";
import {examRequest} from '@/app/api'

const ExamPage=()=>{
    useEffect(()=>{
        examRequest.exams().then(r=>{
            console.log('dsadad',r)
        })
    },[])
    return <Box>
        Hello world
    </Box>
}
export default ExamPage;
