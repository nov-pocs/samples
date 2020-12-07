export declare class AuthorizerV1 {
    private basicAuth;
    private roleAuth;
    private ownerAuth;
    anybody(): (req: any, res: any, next: () => void) => void;
    signed(): (req: any, res: any, next: () => void) => void;
    owner(idParam?: string): (req: any, res: any, next: () => void) => void;
    ownerOrAdmin(idParam?: string): (req: any, res: any, next: () => void) => void;
    siteRoles(roles: string[], idParam?: string): (req: any, res: any, next: () => void) => void;
    admin(): (req: any, res: any, next: () => void) => void;
    siteAdmin(idParam?: string): (req: any, res: any, next: () => void) => void;
    siteManager(idParam?: string): (req: any, res: any, next: () => void) => void;
    siteUser(idParam?: string): (req: any, res: any, next: () => void) => void;
    siteAdminOrOwner(userIdParam?: string, siteIdParam?: string): (req: any, res: any, next: () => void) => void;
}
