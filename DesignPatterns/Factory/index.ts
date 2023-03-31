// 基类
interface Dialog {
  open: () => void
  close: () => void
  operation: () => string
}

// 确认弹窗
class ConfirmDialog implements Dialog {
  public operation(): string {
    return 'confirm dialog'
  }

  public close(): void {
    console.log('just need to confirm')
  }

  public open(): void {
  }
}

// 表单弹窗
class FormDialog implements Dialog {
  public operation(): string {
    return 'form dialog'
  }

  public close(): void {
    console.log('maybe need to interact with backend')
  }

  public open(): void {
  }
}

// 工厂
abstract class DialogCreator {
  public abstract factoryMethod(): Dialog;

  public someOperation(): string {
    const dialog = this.factoryMethod();
    return `Creator: The dialog is ${dialog.operation()}`;
  }
}

// 确认弹窗生成器(流水线1)
class ConfirmDialogCreator extends DialogCreator{
  public factoryMethod(): Dialog {
    return new ConfirmDialog();
  }
}

// 表单弹窗生成器(流水线2)
class FormDialogCreator extends DialogCreator{
  public factoryMethod(): Dialog {
    return new FormDialog();
  }
}

// 具体使用
function dialogOperation(creator: DialogCreator) {
  console.log(creator.someOperation())
  return creator.someOperation()
}

// confirm dialog
const confirmed = dialogOperation(new ConfirmDialogCreator())

// form dialog
const form = dialogOperation(new FormDialogCreator())