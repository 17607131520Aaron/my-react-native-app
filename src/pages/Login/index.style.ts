import { StyleSheet } from 'react-native';

import colors from '~/common/colors';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scannerContainer: {
    height: 200,
    backgroundColor: colors.black,
    position: 'relative',
  },
  scanner: {
    flex: 1,
  },
  scanHint: {
    position: 'absolute',
    bottom: 12,
    left: 0,
    right: 0,
    textAlign: 'center',
    color: colors.white,
    fontSize: 14,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.white,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  orderTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  orderLink: {
    fontSize: 14,
    color: colors.primary,
  },
  productList: {
    flex: 1,
  },
  productItem: {
    backgroundColor: colors.white,
    marginTop: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  productHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  productImagePlaceholder: {
    width: 60,
    height: 60,
    marginRight: 12,
  },
  productImage: {
    width: 60,
    height: 60,
    borderRadius: 4,
  },
  imagePlaceholder: {
    width: 60,
    height: 60,
    backgroundColor: colors.placeholder,
    borderRadius: 4,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
    marginBottom: 4,
  },
  productMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  productCode: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  productPrice: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  quantity: {
    fontSize: 14,
    color: colors.text,
    marginLeft: 8,
  },
  snSection: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
  snHeader: {
    marginBottom: 8,
  },
  snPendingText: {
    fontSize: 14,
    color: colors.warning,
  },
  snCompleteText: {
    fontSize: 14,
    color: colors.success,
  },
  snItem: {
    fontSize: 13,
    color: colors.textTertiary,
    lineHeight: 22,
  },
  footer: {
    padding: 16,
    backgroundColor: colors.white,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
  confirmButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },
  confirmButtonDisabled: {
    backgroundColor: colors.primaryLight,
  },
  confirmButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
});
