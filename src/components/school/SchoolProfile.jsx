
import '..//..//styles/profile/SchoolProfile.css';

const schoolData = {
    name: "Greenfield International School",
    avatar: "https://thietkewebchuyen.com/wp-content/uploads/logo-avatar-free-fire-cute-2.jpg",
    banner: "https://png.pngtree.com/thumb_back/fh260/background/20221011/pngtree-blue-gold-background-banner-idea-modern-simple-free-download-image_1467602.jpg",
    type: "Public School",
    status: "Active",
    address: "123 Nguyen Van Cu, District 5, HCMC",
    representative: "Mrs. Nguyen Thi Mai",
    email: "contact@greenfield.edu.vn",
    phone: "+84 28 8888 8888",
    website: "https://greenfield.edu.vn",
    joined: "Joined Sep 2021",
    description: "Greenfield International School is committed to providing world-class education and nurturing talent for the future. Our campus is home to 2000+ students from primary to high school levels.",
    stats: {
        projects: 8,
        members: 35,
        orders: 17
    },
    projects: [
        {
            id: 1,
            name: "Uniform Design 2023",
            img: "/assets/school-project1.jpg",
            status: "Completed",
            date: "Oct 2023"
        },
        {
            id: 2,
            name: "Sports Outfit Project",
            img: "/assets/school-project2.jpg",
            status: "In Progress",
            date: "Apr 2024"
        }
    ]
};

export default function SchoolProfile() {
    const school = schoolData;
    return (
        <div className="school-profile-page bg-light pb-5">
            {/* Banner + avatar */}
            <div
                className="school-banner"
                style={{
                    backgroundImage: `url(${school.banner})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    height: 200,
                    position: "relative"
                }}
            >
                <div
                    className="school-avatar-box"
                    style={{
                        position: "absolute",
                        left: 40,
                        bottom: -45,
                        display: "flex",
                        alignItems: "center"
                    }}
                >
                    <img
                        src={school.avatar}
                        alt="School Avatar"
                        className="rounded-circle border border-4 border-white shadow"
                        style={{ width: 90, height: 90, objectFit: "cover" }}
                    />
                    <div className="ms-4 d-none d-md-block">
                        <h2 className="fw-bold mb-1">{school.name}</h2>
                        <div className="text-muted mb-1">{school.type}</div>
                        <div className="d-flex align-items-center gap-3">
                            <span className="badge bg-success me-2">{school.status}</span>
                            <span>
                <i className="bi bi-geo-alt-fill me-1"></i>
                                {school.address}
              </span>
                            <span className="text-muted">{school.joined}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="container" style={{ marginTop: 60 }}>
                <div className="row">
                    {/* Main content */}
                    <div className="col-lg-8">
                        {/* Thông tin ngắn cho mobile */}
                        <div className="d-block d-md-none text-center mb-4 mt-2">
                            <h2 className="fw-bold mb-1">{school.name}</h2>
                            <div className="text-muted mb-1">{school.type}</div>
                            <div className="d-flex justify-content-center align-items-center gap-3 mb-2">
                                <span className="badge bg-success me-2">{school.status}</span>
                                <span>
                  <i className="bi bi-geo-alt-fill me-1"></i>
                                    {school.address}
                </span>
                                <span className="text-muted">{school.joined}</span>
                            </div>
                        </div>
                        {/* Contact info */}
                        <div className="mb-4">
                            <h6 className="fw-bold mb-2">Contact</h6>
                            <div className="mb-1">
                                <strong>Representative:</strong> {school.representative}
                            </div>
                            <div className="mb-1">
                                <strong>Email:</strong> <a href={`mailto:${school.email}`}>{school.email}</a>
                            </div>
                            <div className="mb-1">
                                <strong>Phone:</strong> <a href={`tel:${school.phone}`}>{school.phone}</a>
                            </div>
                            <div className="mb-1">
                                <strong>Website:</strong> <a href={school.website} target="_blank" rel="noopener noreferrer">{school.website}</a>
                            </div>
                        </div>
                        {/* About */}
                        <div className="mb-4">
                            <h6 className="fw-bold mb-2">About School</h6>
                            <p className="text-dark">{school.description}</p>
                        </div>
                        {/* Projects */}
                        <div>
                            <h6 className="fw-bold mb-3">School Projects</h6>
                            <div className="row g-3">
                                {school.projects.map((proj) => (
                                    <div className="col-md-6" key={proj.id}>
                                        <div className="card h-100 shadow-sm">
                                            <img
                                                src={proj.img}
                                                alt={proj.name}
                                                className="card-img-top"
                                                style={{ height: 120, objectFit: "cover" }}
                                            />
                                            <div className="card-body">
                                                <div className="d-flex justify-content-between align-items-center mb-1">
                                                    <span className="fw-semibold">{proj.name}</span>
                                                    <span className={`badge ${proj.status === "Completed" ? "bg-success" : "bg-warning text-dark"}`}>
                            {proj.status}
                          </span>
                                                </div>
                                                <div className="text-muted" style={{ fontSize: 14 }}>{proj.date}</div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {school.projects.length === 0 && <div className="col-12 text-muted">No projects yet.</div>}
                            </div>
                        </div>
                    </div>
                    {/* Sidebar */}
                    <div className="col-lg-4 mt-4 mt-lg-0">
                        <div className="card p-4 shadow-sm mb-4">
                            <h6 className="fw-bold mb-3">School Stats</h6>
                            <div className="d-flex justify-content-between mb-2">
                                <span>Total Projects</span>
                                <span className="fw-semibold text-success">{school.stats.projects}</span>
                            </div>
                            <div className="d-flex justify-content-between mb-2">
                                <span>Members</span>
                                <span>{school.stats.members}</span>
                            </div>
                            <div className="d-flex justify-content-between">
                                <span>Orders</span>
                                <span>{school.stats.orders}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
