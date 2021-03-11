import { Test } from "@nestjs/testing";
import { UserService } from "./users.service";
import { User } from "./entities/user.entity";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Verification } from "./entities/verification.entity";
import { JwtService } from "../jwt/jwt.service";
import { MailService } from "../mail/mail.service";
import { Repository } from "typeorm";

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe('UserService', () => {
    let service: UserService;
    let usersRepository: MockRepository<User>;
    let verificationRepository: MockRepository<Verification>;
    let mailService: MailService;
    let jwtService: JwtService;

    const mockRepository = () => ({
        findOne: jest.fn(),
        save: jest.fn(),
        create: jest.fn(),
    });

    const mockJwtRepository = {
        sign: jest.fn(() => 'sign-token-baby'),
        verify: jest.fn(),
    };

    const mockMailRepository = {
        sendVerificationEmail: jest.fn()
    }

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                UserService,
                {
                    provide: getRepositoryToken(User),
                    useValue: mockRepository(),
                },
                {
                    provide: getRepositoryToken(Verification),
                    useValue: mockRepository(),
                },
                {
                    provide: JwtService,
                    useValue: mockJwtRepository
                },
                {
                    provide: MailService,
                    useValue: mockMailRepository
                }
            ],
        }).compile();
        service = module.get<UserService>(UserService);
        usersRepository = module.get(getRepositoryToken(User));
        verificationRepository = module.get(getRepositoryToken(Verification));
        mailService = module.get<MailService>(MailService);
        jwtService = module.get<JwtService>(JwtService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
    
    describe('createAccount', () => {
        const createAccountArgs = {
            email: '',
            password: '',
            role: 0,
        };
        it('should fail if user exists', async () => {
            //Promise의 ResolverdValue를 속일 것이다.
            //jest가 중간에 fineOne 함수를 가로채고 반환 값을 속일 것이다.
            usersRepository.findOne.mockResolvedValue({
                id: '1',
                email: '123@naver.com',
            });
            const result = await service.createAccount(createAccountArgs);
            expect(result).toMatchObject({
                ok: false,
                error: 'There is a user with that email already',
            });
        });
            it('should create a new User', async () => {
                usersRepository.findOne.mockResolvedValue(undefined);
                usersRepository.create.mockReturnValue(createAccountArgs);
                usersRepository.save.mockResolvedValue(createAccountArgs);
                verificationRepository.create.mockReturnValue(createAccountArgs);
                verificationRepository.save.mockResolvedValue({
                    code: 'code',
                });

                const result = await service.createAccount(createAccountArgs);
                expect(usersRepository.create).toHaveBeenCalledTimes(1);
                expect(usersRepository.create).toHaveBeenCalledWith(createAccountArgs);

                expect(usersRepository.save).toHaveBeenCalledTimes(1);
                expect(usersRepository.save).toHaveBeenCalledWith(createAccountArgs);

                expect(verificationRepository.create).toHaveBeenCalledTimes(1);
                expect(verificationRepository.create).toHaveBeenCalledWith({
                    user: createAccountArgs
                });
                
                expect(mailService.sendVerificationEmail).toHaveBeenCalledTimes(1);
                expect(mailService.sendVerificationEmail).toHaveBeenCalledWith(
                    expect.any(String),
                    expect.any(String),
                );

                expect(result).toEqual({ok :true});
                });
                it('should fail on exception', async () => {
                    usersRepository.findOne.mockRejectedValue(new Error());
                    const result = await service.createAccount(createAccountArgs);
                    expect(result).toEqual({ok: false, error: 'Couldn`t create account'});
                });
            });

    describe('login', () => {
        const logInArgs = {
            email: 'bs@email.com',
            password: 'bs.password'
        };
        it('should fail if user does not exist', async () => {
            usersRepository.findOne.mockResolvedValue(null);

            const result = await service.login(logInArgs);

            expect(usersRepository.findOne).toHaveBeenCalledTimes(1);
            expect(usersRepository.findOne).toHaveBeenCalledWith(
                expect.any(Object),
                expect.any(Object)
            )
            expect(result).toEqual({
                ok: false,
                error: 'User not Found'
            });
        });

        it('should fail if the password is wrong', async () => {
            const mockedUser = {
                checkPassword: jest.fn(() => Promise.resolve(false))
            };
            usersRepository.findOne.mockResolvedValue(mockedUser);
            const result = await service.login(logInArgs);
            expect(result).toEqual({
                ok: false,
                error: 'Wrong password'
            });
        });

        it('should fail on exception', async () => {
            usersRepository.findOne.mockResolvedValue(new Error());
            const result = await service.login(logInArgs);
            expect(result).toEqual({
                ok: false,
                error: "User not found"
            });
        });
 
        it('should return token if password correct', async () => {
            const mockedUser = {
                id: 1,
                checkPassword: jest.fn(() => Promise.resolve(true))
            };
            usersRepository.findOne.mockResolvedValue(mockedUser);
            const result = await service.login(logInArgs);
            expect(jwtService.sign).toHaveBeenCalledTimes(1);
            expect(jwtService.sign).toHaveBeenCalledWith(
                expect.any(Number)
            );
            expect(result).toEqual({
                ok: true,
                token: 'sign-token-baby'
            });
        });
    });
    it.todo('findById');
    it.todo('editProfile');
    it.todo('verifyEmail');
});