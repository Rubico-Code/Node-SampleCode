import { AutoIncrement, Column, PrimaryKey, Table } from 'sequelize-typescript';
import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';
import { DatesMapping } from './dates-mapping';

@Table({})
export class BaseModel<T> extends DatesMapping<T> {
  /**
   * Set this to true to force converting to numeric value
   * @protected
   */
  protected convertToInt = false;

  @ApiModelProperty({ type: Number })
  @PrimaryKey
  @AutoIncrement
  @Column({
    get() {
      const value = this.getDataValue('id');
      if (!!(this as BaseModel<any>).convertToInt) {
        return parseFloat(value);
      }
      return value;
    },
  })
  public id: number;

  /**
   * @inheritDoc
   */
  public toJSON(): any {
    return super.toJSON();
  }
}
