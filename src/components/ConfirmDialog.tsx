import { Button, Dialog, Portal, Text, useTheme } from 'react-native-paper';

interface ConfirmDialogProps {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  destructive?: boolean;
  hideCancel?: boolean;
  onConfirm: () => void;
  onDismiss: () => void;
}

/**
 * Alert.alert renders nothing on react-native-web, so any confirm/destructive
 * flow needs a real (Portal-rendered) dialog to work in the browser build.
 */
export function ConfirmDialog({
  visible,
  title,
  message,
  confirmLabel = 'Confirm',
  destructive = false,
  hideCancel = false,
  onConfirm,
  onDismiss,
}: ConfirmDialogProps) {
  const theme = useTheme();

  return (
    <Portal>
      <Dialog visible={visible} onDismiss={onDismiss}>
        <Dialog.Title>{title}</Dialog.Title>
        <Dialog.Content>
          <Text variant="bodyMedium">{message}</Text>
        </Dialog.Content>
        <Dialog.Actions>
          {hideCancel ? null : <Button onPress={onDismiss}>Cancel</Button>}
          <Button textColor={destructive ? theme.colors.error : undefined} onPress={onConfirm}>
            {confirmLabel}
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}
