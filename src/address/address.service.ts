import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { Address, AddressDocument } from 'src/db/schemas/Address';

@Injectable()
export class AddressService {
  constructor(
    @InjectModel(Address.name) private addressModel: Model<AddressDocument>,
  ) {}

  async create(createAddressDto: CreateAddressDto): Promise<Address> {
    const createdAddress = new this.addressModel(createAddressDto);
    return createdAddress.save();
  }

  async findAll(owner: string): Promise<Address[]> {
    return this.addressModel
      .find({
        owner,
      })
      .exec();
  }

  async findOne(id: string, owner: string): Promise<Address> {
    const address = await this.addressModel.findOne({
      _id: id,
      owner,
    });

    if (!address) {
      throw new NotFoundException(`Address with ID ${id} not found`);
    }
    return address;
  }

  async update(
    id: string,
    updateAddressDto: UpdateAddressDto,
  ): Promise<Address> {
    const updatedAddress = await this.addressModel
      .findByIdAndUpdate(id, updateAddressDto, { new: true })
      .exec();

    if (!updatedAddress) {
      throw new NotFoundException(`Address with ID ${id} not found`);
    }

    return updatedAddress;
  }

  async remove(id: string, owner: string): Promise<Address> {
    const deletedAddress = await this.addressModel
      .findOneAndDelete({
        _id: id,
        owner,
      })
      .exec();

    if (!deletedAddress) {
      throw new NotFoundException(`Address with ID ${id} not found`);
    }

    return deletedAddress;
  }
}
