import '../../styles/ui/DashboardWebUILayout.css'
import {Link, Typography} from "@mui/material";
import {Outlet} from "react-router-dom";

function RenderNav({navigation}) {

    function RenderNavCaption({label}) {
        return (
            <Typography variant={"h6"} sx={{marginTop: '2vh'}}>{label}</Typography>
        )
    }

    function RenderNavSub({label, segment}) {
        return (
            <Link
                href={segment}
                variant={"body2"}
                underline={"none"}
                color={"textPrimary"}
                sx={
                    {
                        marginLeft: "2vw",
                        cursor: 'pointer'
                    }
                }
            >
                {label}
            </Link>
        )
    }

    return (
        <div>
            {
                navigation.map((el, index) => {
                    if (el.type === 'caption') {
                        return (
                            <div key={index}><RenderNavCaption label={el.label}/></div>
                        )
                    } else {
                        return (
                            <div key={index}><RenderNavSub label={el.label} segment={el.segment}/></div>
                        )
                    }
                })
            }
        </div>
    )
}

function RenderPage({navigation}) {
    return (
        <div className={'dbwui-main'}>
            <div className={'dbwui-nav'}>
                <RenderNav navigation={navigation}/>
            </div>
            <div className={'dbwui-outlet'}>
                <Outlet/>
            </div>
        </div>
    )
}

export default function SchoolDashboardUILayout({navigation}) {
    return (
        <RenderPage navigation={navigation}/>
    )
}