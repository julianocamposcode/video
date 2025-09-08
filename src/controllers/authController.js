import jwt from 'jsonwebtoken';
const USERS = [
    { id: 1, username: 'admin', password: 'admin123', role: 'admin' },
    { id: 2, username: 'user', password: 'user123', role: 'user' },
];

export async function Login(req, res) {
    const { username, password } = req.body;
    const user = USERS.find(u => u.username === username && u.password === password);
    if (!user) return res.status(401).json({ message: 'Credenciais inválidas' });
    const token = jwt.sign({ sub: user.id, role: user.role }, process.env.JWT_SECRET,{expiresIn: process.env.JWT_EXPIRES_IN, issuer: 'myapp'});
    return res.json({ access_token: token, token_type: 'Bearer ' });
}