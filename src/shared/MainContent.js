import * as React from "react";
import { styled } from "@mui/material/styles";
import { Link, useLocation } from "react-router-dom";

import {
    Box,
    List,
    Divider,
    IconButton,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
} from "@mui/material";

import MuiDrawer from "@mui/material/Drawer";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";

import NavIcons from "../components/icons";

const drawerWidth = 260;

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })(
    ({ theme, open }) => ({
        flexGrow: 1,
        width: "100%",
        padding: theme.breakpoints.up("lg")
            ? theme.spacing(16, 16)
            : theme.spacing(12, 16),
        transition: theme.transitions.create("margin", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        marginLeft: 0,
        ...(open && {
            transition: theme.transitions.create("margin", {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.enteringScreen,
            }),
            marginLeft: 0,
        }),
    })
);

const openedMixin = (theme) => ({
    width: drawerWidth,
    padding: theme.spacing(8, 6),
    transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    border: "none",
    elevation: 0,
    background: theme.palette.background.light,
    overflowX: "hidden",
});

const closedMixin = (theme) => ({
    transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    border: "none",
    elevation: 0,
    background: theme.palette.background.light,
    overflowX: "hidden",
    width: `calc(${theme.spacing(15)} + 1px)`,
    [theme.breakpoints.up("sm")]: {
        width: `calc(${theme.spacing(16)} + 1px)`,
    },
    padding: theme.spacing(8, 2.5),
});

const DrawerHeader = styled("div")(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: theme.spacing(0, 1),

    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
}));

const Drawer = styled(MuiDrawer, {
    shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: "nowrap",
    boxSizing: "border-box",

    ...(open && {
        ...openedMixin(theme),
        "& .MuiDrawer-paper": openedMixin(theme),
    }),
    ...(!open && {
        ...closedMixin(theme),
        "& .MuiDrawer-paper": closedMixin(theme),
    }),
}));

const DrawerItem = styled(ListItemButton, {
    shouldForwardProp: (prop) => prop !== "selected",
})(({ theme, selected }) => ({
    minHeight: 44,
    padding: theme.spacing(0, 2.5),
    "&:hover": {
        backgroundColor: theme.palette.action.soft,
    },
    "& *": {
        color: selected ? theme.palette.primary.main : theme.palette.neutral.medium,
    },
    "& .MuiTouchRipple-child": {
        backgroundColor: theme.palette.action.main,
    },
    "& path": {
        fill: selected ? theme.palette.primary.main : theme.palette.neutral.medium,
    },
    borderRadius: theme.spacing(1),
    marginBottom: theme.spacing(3),
}));

var drawerOpen = false;
function setDrawerOpen(open) {
    drawerOpen = open;
}

const DrawerPages = [
    {
        icon: <NavIcons.HomeIcon />,
        label: "Home",
        page: "home",
        to: "/",
    },
    {
        icon: <NavIcons.CourseIcon />,
        label: "Courses",
        page: "courses",
        to: "/courses",
    },
    {
        icon: <NavIcons.CalendarIcon />,
        label: "Timetable",
        page: "timetable",
        to: "/timetable",
    },
];

const MainContent = ({ children }) => {
    const location = useLocation();
    const page = location.pathname;
    const [open, setOpen] = React.useState(drawerOpen);

    return (
        <Box sx={{ display: "flex" }}>
            <Box sx={{ display: "flex" }}>
                <Drawer variant="permanent" open={open}>
                    <DrawerHeader>
                        {open ? (
                            <IconButton
                                onClick={() => {
                                    setOpen(false);
                                    setDrawerOpen(false);
                                }}
                            >
                                <ChevronLeftIcon />
                            </IconButton>
                        ) : (
                            <IconButton
                                onClick={() => {
                                    setOpen(true);
                                    setDrawerOpen(true);
                                }}
                            >
                                <MenuIcon />
                            </IconButton>
                        )}
                    </DrawerHeader>
                    <Divider sx={{ my: 6 }} />
                    <List>
                        {DrawerPages.map((item) => (
                            <ListItem
                                key={item.label}
                                disablePadding
                                sx={{ display: "block", borderRadius: 4 }}
                            >
                                <DrawerItem
                                    selected={page === item.to}
                                    sx={{
                                        justifyContent: open ? "initial" : "center",
                                        bgcolor: page === item.to ? "action.soft" : "background",
                                    }}
                                    component={Link}
                                    to={item.to}
                                >
                                    <ListItemIcon
                                        sx={{
                                            minWidth: 0,
                                            mr: open ? 3 : "auto",
                                            justifyContent: "center",
                                        }}
                                    >
                                        {item.icon}
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={item.label}
                                        sx={{ opacity: open ? 1 : 0 }}
                                    />
                                </DrawerItem>
                            </ListItem>
                        ))}
                    </List>
                </Drawer>
                <Main open={open}>{children}</Main>
            </Box>
        </Box>
    );
};

export default MainContent;
