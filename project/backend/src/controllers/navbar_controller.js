async function GetNavbarData(req, res) {
    try {
        const navbarData = [
            { id: 1, label: "Home", link: "/" },
            { id: 2, label: "Courses", link: "/courses" },
            { id: 3, label: "Profile", link: "/profile" },
        ];
        res.status(200).json(navbarData);
    } catch (error) {
        console.error(error);
        res.status(500).send("Failed to fetch navbar data");
    }
}

export { GetNavbarData };