interface traderProps {
  id: string;
  photo: string;
  firstName: string;
  lastNamePaternal: string;
  lastNameMaternal: string;
  dni: string;
  address: string;
  phone: string;
  grantDate: Date;
}

export class Trader {
  id: string;
  photo: string;
  firstName: string;
  lastNamePaternal: string;
  lastNameMaternal: string;
  dni: string;
  address: string;
  phone: string;
  grantDate: Date;

  constructor({
    id,
    photo,
    firstName,
    lastNamePaternal,
    lastNameMaternal,
    dni,
    address,
    phone,
    grantDate,
  }: traderProps) {
    this.id = id;
    this.photo = photo;
    this.firstName = firstName;
    this.lastNamePaternal = lastNamePaternal;
    this.lastNameMaternal = lastNameMaternal;
    this.dni = dni;
    this.address = address;
    this.phone = phone;
    this.grantDate = grantDate;
  }

  get fullName() {
    return `${this.firstName} ${this.lastNamePaternal} ${this.lastNameMaternal}`;
  }
}
