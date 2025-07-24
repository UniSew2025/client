import {useEffect, useState} from "react";
import {getALlPackageByDesignerId} from "../../services/ProfileService.jsx";
import {getAllRequestByListPackageId} from "../../services/DesignService.jsx";
import {Table, TableBody, TableCell, TableHead, TableRow, CircularProgress, Button} from "@mui/material";
import {useNavigate} from "react-router-dom";

export default function DesignerRequest() {
    const [designerId, setDesignerId] = useState(null);
    const [packages, setPackages] = useState([]);
    const [packageIds, setPackageIds] = useState([]);
    const [designRequests, setDesignRequests] = useState([]);
    const [loading, setLoading] = useState(true);


    const user = JSON.parse(localStorage.getItem("user"));
    const navigate = useNavigate();


    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const user = JSON.parse(localStorage.getItem("user"));
                console.log("user:", user);
                const dId = user?.profile?.partner?.id || user?.profile?.partner?.id ;
                console.log("designerId:", dId);

                setDesignerId(dId);

                if (!dId) {
                    setDesignRequests([]);
                    setLoading(false);
                    return;
                }

                const packagesRes = await getALlPackageByDesignerId(dId);
                console.log("packagesResRE", packagesRes);

                setPackages(packagesRes?.data || []);
                const pIds = Array.isArray(packagesRes?.data)
                    ? packagesRes.data.map(pkg => pkg.id)
                    : [];
                setPackageIds(pIds);

                if (pIds.length === 0) {
                    setDesignRequests([]);
                    setLoading(false);
                    return;
                }

                const requests = await getAllRequestByListPackageId(pIds);
                setDesignRequests(requests?.data || []);
            } catch (e) {
                console.error("fetchData error:", e);
                setDesignRequests([]);
                setPackages([]);
                setPackageIds([]);
                setDesignerId(null);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleViewDetail = (item) =>  {
        navigate('/designer/request/detail', {
            state: {
                requestId: item.id,
                requestStatus: item.status,
                packageId: item.packageId,
                request : item
            }
        });
    }

    console.log(user.profile.partner.id);
    console.log("designerId:", designerId);
    console.log("packages:", packages);
    console.log("packageIds:", packageIds);
    console.log("designRequests:", designRequests);

    return (
        <div className={'outlet-container'}>
            <h1>Designer request list</h1>
            {loading ? (
                <CircularProgress />
            ) : designRequests.length === 0 ? (
                <div>No design requests found.</div>
            ) : (
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Package ID</TableCell>
                            <TableCell>School</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Created At</TableCell>
                            <TableCell>Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {designRequests.map((req) => (
                            <TableRow key={req.id}>
                                <TableCell>{req.id}</TableCell>
                                <TableCell>{req.packageId}</TableCell>
                                <TableCell>{req.school?.name|| ""}</TableCell>
                                <TableCell>{req.status}</TableCell>
                                <TableCell>{req.creationDate}</TableCell>
                                <TableCell><Button onClick={() => handleViewDetail(req)}>View</Button></TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}
        </div>
    );
}
