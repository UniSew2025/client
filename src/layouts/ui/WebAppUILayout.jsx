import '../../styles/ui/WebAppUILayout.css'
import {Badge, Button, Divider, IconButton, Link, ListItemIcon, Menu, MenuItem, Typography,} from "@mui/material";
import {
    AccountBox,
    DesignServices,
    Inventory,
    KeyboardArrowDown,
    KeyboardArrowUp,
    Logout,
    Notifications
} from '@mui/icons-material';
import {Outlet, useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";


function RenderFooterPolicyButton({link, title}) {
    const navigate = useNavigate()

    return (
        <Link
            component={"button"}
            variant={"body2"}
            underline={"none"}
            color={"textPrimary"}
            onClick={() => navigate(link)}
        >
            {title}
        </Link>
    )
}

function RenderHeaderButton({link, title}) {
    const navigate = useNavigate()

    return (
        <Button
            className={"btn-link"}
            variant={"text"}
            onClick={() => navigate(link)}
        >
            {title}
        </Button>
    )
}

function RenderHeaderMenuButton({title, children}) {
    const navigate = useNavigate()
    const [anchorEl, setAnchorEl] = useState(null)
    const open = Boolean(anchorEl)

    const handleClick = (e) => {
        setAnchorEl(anchorEl === null ? e.currentTarget : null)
    }

    const handleCloseMenu = (link) => {
        if (link !== null) {
            navigate(link)
        }
        setAnchorEl(null)
    }

    return (
        <>
            <Button
                className={"btn-link"}
                variant={"text"}
                onClick={handleClick}
                endIcon={open ? <KeyboardArrowUp fontSize={"medium"}/> : <KeyboardArrowDown fontSize={"large"}/>}
            >
                {title}
            </Button>
            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={() => handleCloseMenu(null)}
            >
                {
                    children.map((child, index) => (
                        <MenuItem key={index} onClick={() => handleCloseMenu(child.link)}>{child.title}</MenuItem>
                    ))
                }
            </Menu>
        </>
    )
}

function RenderHeaderProfileButton({children}) {
    const navigate = useNavigate()
    const [anchorEl, setAnchorEl] = useState(null)
    const open = Boolean(anchorEl)

    const handleClick = (e) => {
        setAnchorEl(anchorEl === null ? e.currentTarget : null)
    }

    const handleCloseMenu = (link) => {
        if (link !== null) {
            navigate(link)
        }
        setAnchorEl(null)
    }

    return (
        <>
            <Button
                className={"btn-link"}
                variant={"text"}
                onClick={handleClick}
                fullWidth
                endIcon={
                    <img
                        className={'profile-btn-image'}
                        referrerPolicy={"no-referrer"}
                        src={JSON.parse(localStorage.getItem('user')).profile.avatar}
                        alt={""}
                    />
                }
                sx={{color: "black", whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}
            >
                {JSON.parse(localStorage.getItem('user')).profile.name}
            </Button>
            <Menu
                anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}
                transformOrigin={{vertical: 'top', horizontal: 'right'}}
                anchorEl={anchorEl}
                open={open}
                onClose={() => handleCloseMenu(null)}
            >
                {
                    children.map((child, index) => (
                        <MenuItem key={index} sx={{width: '15vw'}} onClick={() => handleCloseMenu(child.link)}>
                            <ListItemIcon>
                                {child.icon}
                            </ListItemIcon>
                            {child.title}
                        </MenuItem>
                    ))
                }
            </Menu>
        </>
    )
}

function RenderHeader() {
    const navigate = useNavigate()
    const existedUser = JSON.parse(localStorage.getItem("user"));
    const profileLink = existedUser ? '/' + existedUser.role + "/profile" : null
    const notification = 0
    return (
        <div className="home-header">
            <img src={"/logo_full.png"} alt="UniSew"/>
            <div className="header-content">
                <RenderHeaderButton
                    link={"/home"}
                    title="Home"
                />
                {!existedUser && (
                    <RenderHeaderMenuButton
                        title="Become Partner"
                        children={[
                            {
                                link: '/home',
                                title: 'Join Designer'
                            },
                            {
                                link: '/home',
                                title: 'Join Garment Factory'
                            }
                        ]}
                    />
                )}
                {existedUser && (
                    <Button
                        variant={"outlined"}
                        color={"primary"}
                        onClick={() => navigate('/school/d/design')}
                    >
                        Create my design
                    </Button>
                )}
            </div>
            <div className="header-buttons">
                {!existedUser ? (
                    <Button variant={"outlined"} sx={{color: "black", borderColor: "black"}}
                            onClick={() => navigate("/signin")}>Sign in</Button>
                ) : (
                    <>
                        <IconButton>
                            <Badge badgeContent={notification} max={10} color={"error"} invisible={notification === 0}>
                                <Notifications sx={{height: '30px', width: '30px'}} color={"warning"}/>
                            </Badge>
                        </IconButton>
                        <RenderHeaderProfileButton
                            children={
                                existedUser.role === 'school' ?
                                    [
                                        {
                                            link: profileLink,
                                            title: 'Profile',
                                            icon: <AccountBox fontSize={"small"} color={"info"}/>
                                        },
                                        {
                                            link: '/school/d/design',
                                            title: 'My Designs',
                                            icon: <DesignServices fontSize={"small"} color={"primary"}/>
                                        },
                                        {
                                            link: '/school/d/order',
                                            title: 'My Orders',
                                            icon: <Inventory fontSize={"small"} color={"secondary"}/>
                                        },
                                        {
                                            link: '/signin',
                                            title: 'Sign out',
                                            icon: <Logout fontSize={"small"} color={"error"}/>
                                        }
                                    ]
                                    :
                                    [
                                        {
                                            link: profileLink,
                                            title: 'Profile',
                                            icon: <AccountBox fontSize={"small"} color={"info"}/>
                                        },
                                        {
                                            link: '/signin',
                                            title: 'Sign out',
                                            icon: <Logout fontSize={"small"} color={"error"}/>
                                        }
                                    ]
                            }
                        />
                    </>
                )}

            </div>
        </div>
    )
}

function RenderFooter() {
    const today = new Date();

    return (
        <div className={"home-footer"}>
            <div className={"footer-content"}>
                <img src={"/logo_full.png"} alt="UniSew"/>
                <div className={"footer-item"}>
                    <Typography variant={"body1"} sx={{fontWeight: "bold", color: 'black'}}>About UniSew</Typography>
                    <RenderFooterPolicyButton title={"About us"} link={"/info/about"}/>
                    <RenderFooterPolicyButton title={"Contact us"} link={"/info/contact"}/>
                </div>
                <div className={"footer-item"}>
                    <Typography variant={"body1"} sx={{fontWeight: "bold", color: 'black'}}>Resources</Typography>
                    <RenderFooterPolicyButton title={"Order policy"} link={"/policy/order"}/>
                    <RenderFooterPolicyButton title={"Return policy"} link={"/policy/return"}/>
                    <RenderFooterPolicyButton title={"Privacy policy"} link={"/policy/privacy"}/>
                    <RenderFooterPolicyButton title={"Terms of service"} link={"/policy/term"}/>
                </div>
                <div className={"footer-item"}>
                    <Typography variant={"body1"} sx={{fontWeight: "bold", color: 'black'}}>Payment</Typography>
                    <img src={"/payos.png"} alt="PayOS"/>
                </div>
            </div>
            <Divider/>
            <div className={"footer-right"}>
                <span>&copy; {today.getFullYear()} UniSew, powered by UniSew team, All rights reserved.</span>
            </div>
        </div>
    )
}

function RenderPage() {
    const [isAtTop, setIsAtTop] = useState(false);

    useEffect(() => {
        const checkScrollPosition = () => {
            const currentScrollY = window.scrollY || window.pageYOffset;
            const currentScrollX = window.scrollX || window.pageXOffset;

            if (currentScrollY === 0 && currentScrollX === 0) {
                setIsAtTop(true);
            } else {
                setIsAtTop(false);
            }
        };

        checkScrollPosition();

        window.addEventListener('scroll', checkScrollPosition);

        return () => {
            window.removeEventListener('scroll', checkScrollPosition);
        };
    }, []);

    return (
        <div className={"home-main"}>
            <RenderHeader/>
            <div className={"home-body"}>
                <Outlet/>
            </div>
            <RenderFooter/>
            <IconButton
                sx={{
                    position: 'fixed',
                    bottom: 20,
                    right: 20,
                    opacity: isAtTop ? 0 : 1,
                    visibility: isAtTop ? 'hidden' : 'visible',
                    pointerEvents: isAtTop ? 'none' : 'auto',

                    transition: 'opacity 0.3s ease-in-out, visibility 0.3s ease-in-out',
                    zIndex: 1000,

                    '& .MuiSvgIcon-root': {
                        fill: 'white',
                        backgroundColor: 'gray',
                        fontSize: '3.5rem',
                        borderRadius: '50px',
                        transition: 'background-color 0.3s ease',
                        "&:hover": {
                            backgroundColor: "rgb(0% 18% 42%)"
                        }
                    }
                }}
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
                <KeyboardArrowUp />
            </IconButton>
        </div>
    )
}

export default function WebAppUILayout() {
    if(localStorage.getItem('user') && JSON.parse(localStorage.getItem('user')).role !== 'school'){
        window.location.href = "/signin"
    }
    return (
        <RenderPage/>
    )
}
